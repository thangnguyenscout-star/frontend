<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import AppButton from '@/components/common/AppButton.vue';
import { usePermission } from '@/composables/usePermission';
import { startAttendanceImport, type AttendanceInsertResult } from '@/services/modules/attendance-import.service';
import { getApiErrorMessage } from '@/utils/error-message';
import { parseAttendanceDatRows, validateFile } from './sync.utils';
import type { AttendanceFrontendRow } from './sync.types';

type FileState = 'PENDING' | 'PROCESSED' | 'INVALID' | 'SAVING' | 'COMPLETED' | 'UNCERTAIN';
interface LocalSummary { total: number; VALID: number; DUPLICATE: number; INVALID: number }
interface SelectedFile {
  id: string;
  file: File;
  state: FileState;
  rows: AttendanceFrontendRow[];
  result?: AttendanceInsertResult;
  error?: string;
}

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ close: []; busy: [value: boolean] }>();
const permission = usePermission();
const canWrite = computed(() => permission.can('attendance', 'create'));
const files = ref<SelectedFile[]>([]);
const working = ref(false);
const processed = ref(false);
const selectionError = ref('');
const validRows = (item: SelectedFile) => item.rows.filter((row) => row.status === 'VALID');
const hasPendingSave = computed(() => files.value.some((item) => item.state === 'PROCESSED' && validRows(item).length > 0));
const localRows = computed(() => files.value.flatMap((item) => item.rows.map((row) => ({ ...row, sourceFileName: item.file.name }))));
const previewRows = computed(() => localRows.value.slice(0, 100));
const localSummary = computed(() => localRows.value.reduce<LocalSummary>((summary, row) => {
  summary.total++;
  const status = row.status === 'VALID' || row.status === 'DUPLICATE' ? row.status : 'INVALID';
  summary[status]++;
  return summary;
}, { total: 0, VALID: 0, DUPLICATE: 0, INVALID: 0 }));

watch(working, (value) => emit('busy', value), { flush: 'sync' });
function fileId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function displaySize(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function addFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  const picked = Array.from(input.files ?? []);
  input.value = '';
  selectionError.value = '';
  if (!picked.length || working.value || processed.value || !canWrite.value) return;
  const problems: string[] = [];
  const next = [...files.value];
  for (const file of picked) {
    try {
      if (!/\.dat$/i.test(file.name)) throw new Error('chỉ nhận file .dat.');
      validateFile(file);
      if (next.some((item) => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified))
        throw new Error('file đã có trong danh sách.');
      next.push({ id: fileId(), file, state: 'PENDING', rows: [] });
    } catch (error) {
      problems.push(`${file.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  files.value = next;
  selectionError.value = problems.join(' ');
}
function removeFile(id: string) {
  if (working.value || processed.value) return;
  files.value = files.value.filter((item) => item.id !== id);
}
async function startProcessing() {
  if (!canWrite.value || working.value || processed.value || !files.value.length) return;
  working.value = true;
  selectionError.value = '';
  const seenKeys = new Set<string>();
  try {
    for (const item of files.value) {
      item.state = 'PENDING';
      item.rows = [];
      item.error = undefined;
      try {
        item.rows = parseAttendanceDatRows(await item.file.text(), seenKeys);
        item.state = 'PROCESSED';
      } catch (error) {
        item.state = 'INVALID';
        item.error = getApiErrorMessage(error);
      }
    }
    processed.value = true;
  } finally {
    working.value = false;
  }
}
async function saveToDatabase() {
  if (!canWrite.value || working.value || !processed.value || !hasPendingSave.value) return;
  working.value = true;
  try {
    for (const item of files.value) {
      if (item.state !== 'PROCESSED' || !item.rows.length) continue;
      const rowsToSave = validRows(item);
      if (!rowsToSave.length) continue;
      item.state = 'SAVING';
      item.error = undefined;
      try {
        // The current backend input is AttendanceFrontendRowInput. Keep its known
        // shape, but never send invalid or frontend-duplicate rows.
        item.result = await startAttendanceImport({ rows: rowsToSave });
        item.state = 'COMPLETED';
      } catch (error) {
        // The server may have committed the import even if its response was lost.
        if (error && typeof error === 'object' && 'partialResult' in error)
          item.result = (error as { partialResult: AttendanceInsertResult }).partialResult;
        item.state = 'UNCERTAIN';
        item.error = getApiErrorMessage(error);
        break;
      }
    }
  } finally {
    working.value = false;
  }
}
function reset() {
  if (working.value) return;
  files.value = [];
  processed.value = false;
  selectionError.value = '';
}
function close() {
  if (!working.value) emit('close');
}
function statusLabel(status: string | null) {
  return status === 'VALID' ? 'Hợp lệ' : status === 'DUPLICATE' ? 'Trùng' : 'Lỗi';
}
function statusSeverity(status: string | null) {
  return status === 'VALID' ? 'success' : status === 'DUPLICATE' ? 'warn' : 'danger';
}
function resultJson(result: AttendanceInsertResult) {
  return JSON.stringify(result, null, 2);
}
onBeforeUnmount(() => emit('busy', false));
</script>

<template>
  <Dialog
    :visible="props.visible"
    header="Đồng bộ file DAT chấm công"
    modal
    :style="{ width: '1050px', maxWidth: '96vw' }"
    :closable="!working"
    :close-on-escape="!working"
    @update:visible="close"
  >
    <div class="sync-form">
      <p class="sync-notice">
        Chọn file rồi nhấn <strong>Bắt đầu đồng bộ</strong> để kiểm tra và xem trước trên trình duyệt.
        Nút <strong>Lưu vào database</strong> mới gửi dữ liệu lên server.
      </p>
      <p
        v-if="!canWrite"
        class="sync-notice warning"
        role="alert"
      >
        Bạn cần quyền attendance:create để đồng bộ file chấm công.
      </p>
      <label class="file-picker">
        Chọn file DAT
        <input
          type="file"
          accept=".dat"
          multiple
          :disabled="working || processed || !canWrite"
          @change="addFiles"
        >
      </label>

      <p
        v-if="selectionError"
        class="sync-error"
        role="alert"
      >
        {{ selectionError }}
      </p>
      <section
        v-if="files.length"
        class="phase-one-files"
        aria-label="Danh sách file đã chọn"
      >
        <h3>Danh sách file</h3>
        <ol>
          <li
            v-for="item in files"
            :key="item.id"
          >
            <div class="import-file-main">
              <strong>{{ item.file.name }}</strong>
              <small>{{ displaySize(item.file.size) }}</small>
              <small
                v-if="item.error"
                class="sync-error"
              >{{ item.error }}</small>
              <small
                v-if="item.state === 'UNCERTAIN'"
                class="sync-error"
              >
                Server có thể đã xử lý file; không tự gửi lại. Hãy kiểm tra kết quả trên hệ thống trước khi chọn gửi lại.
              </small>
            </div>
            <div class="phase-one-file-actions">
              <Tag
                v-if="item.state === 'PENDING'"
                value="Chờ xử lý"
                severity="secondary"
              />
              <Tag
                v-else-if="item.state === 'PROCESSED'"
                value="Đã xử lý trên FE"
                severity="info"
              />
              <Tag
                v-else-if="item.state === 'INVALID'"
                value="File không hợp lệ"
                severity="danger"
              />
              <Tag
                v-else-if="item.state === 'SAVING'"
                value="Đang lưu"
                severity="info"
              />
              <Tag
                v-else-if="item.state === 'COMPLETED'"
                value="Đã lưu"
                severity="success"
              />
              <Tag
                v-else-if="item.state === 'UNCERTAIN'"
                value="Cần kiểm tra"
                severity="warn"
              />
              <AppButton
                label="Xóa"
                text
                severity="danger"
                :disabled="working || processed"
                @click="removeFile(item.id)"
              />
            </div>
          </li>
        </ol>
      </section>

      <section
        v-if="working && !processed"
        class="sync-import-progress"
        role="status"
        aria-live="polite"
      >
        Đang đọc DAT, kiểm tra từng dòng và loại trùng trong các file đã chọn…
      </section>
      <section
        v-if="processed"
        class="sync-import-progress"
      >
        <strong>Kết quả xử lý trên frontend</strong>
        <div class="sync-preview-counts">
          <Tag
            :value="`Tổng dòng: ${localSummary.total}`"
            severity="info"
          />
          <Tag
            :value="`Hợp lệ: ${localSummary.VALID}`"
            severity="success"
          />
          <Tag
            :value="`Trùng: ${localSummary.DUPLICATE}`"
            severity="warn"
          />
          <Tag
            :value="`Lỗi: ${localSummary.INVALID}`"
            severity="danger"
          />
        </div>
        <small>Preview hiển thị tối đa 100 dòng. Dữ liệu chưa được lưu database.</small>
        <DataTable
          :value="previewRows"
          data-key="line"
          scrollable
          scroll-height="320px"
          size="small"
          :table-style="{ minWidth: '850px' }"
        >
          <template #empty>
            Không có dòng để xem trước.
          </template>
          <Column
            field="sourceFileName"
            header="File"
          />
          <Column
            field="line"
            header="Dòng"
          />
          <Column
            field="machineNo"
            header="Mã máy"
          />
          <Column
            field="user"
            header="Mã người dùng máy"
          />
          <Column
            field="time"
            header="Thời gian quét"
          />
          <Column
            field="eventType"
            header="Loại sự kiện"
          />
          <Column
            field="status"
            header="FE kiểm tra"
          >
            <template #body="{ data }">
              <Tag
                :value="statusLabel(data.status)"
                :severity="statusSeverity(data.status)"
              />
            </template>
          </Column>
          <Column
            field="message"
            header="Thông tin"
          />
        </DataTable>
      </section>

      <section
        v-for="item in files.filter(file => file.result)"
        :key="`${item.id}-result`"
        class="sync-import-progress"
        :aria-label="`Kết quả ${item.file.name}`"
      >
        <div class="sync-result-heading">
          <i class="pi pi-check-circle" />
          <div><strong>{{ item.file.name }}</strong><p>{{ item.result?.trangThai }}</p></div>
        </div>
        <div class="sync-result-stats">
          <article><small>Tổng bản ghi</small><strong>{{ item.result?.tongBanGhi }}</strong></article>
          <article><small>Bản ghi mới</small><strong>{{ item.result?.soBanGhiMoi }}</strong></article>
          <article><small>Bản ghi trùng</small><strong>{{ item.result?.soBanGhiTrung }}</strong></article>
          <article><small>Bản ghi lỗi</small><strong>{{ item.result?.soBanGhiLoi }}</strong></article>
          <article><small>Chưa mapping</small><strong>{{ item.result?.soBanGhiChuaMapping }}</strong></article>
        </div>
        <div
          v-if="item.result?.loi.length"
          class="sync-result-errors"
        >
          <h3>Lỗi theo dòng</h3>
          <ul>
            <li
              v-for="(entry, index) in item.result.loi"
              :key="`${entry.line}-${index}`"
            >
              Dòng {{ entry.line }}: {{ entry.maLoi }}
            </li>
          </ul>
        </div>
        <details>
          <summary>Xem JSON trả về</summary>
          <pre>{{ resultJson(item.result!) }}</pre>
        </details>
      </section>

      <footer class="sync-dialog-footer">
        <AppButton
          label="Đóng"
          severity="secondary"
          outlined
          :disabled="working"
          @click="close"
        />
        <AppButton
          v-if="processed"
          label="Xóa kết quả / chọn lại"
          severity="secondary"
          outlined
          :disabled="working"
          @click="reset"
        />
        <AppButton
          v-if="!processed"
          label="Bắt đầu đồng bộ"
          icon="pi pi-play"
          :disabled="!files.length || working || !canWrite"
          :loading="working"
          @click="startProcessing"
        />
        <AppButton
          v-else
          label="Lưu vào database"
          icon="pi pi-save"
          :disabled="!hasPendingSave || working || !canWrite"
          :loading="working"
          @click="saveToDatabase"
        />
      </footer>
    </div>
  </Dialog>
</template>
<style scoped src="./sync.css"></style>
