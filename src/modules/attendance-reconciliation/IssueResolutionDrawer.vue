<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import AppDrawer from '@/components/common/AppDrawer.vue';
import AppDialog from '@/components/common/AppDialog.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useToast } from '@/composables/useToast';
import { useReconciliation } from './useReconciliation';
import { DEMO_NOTICE } from './reconciliation.fixtures';
import {
  adjustmentTypes,
  adjustmentLabels,
  issueLabels,
  formatStamp,
  formatDate,
  formatTime,
  type Actor,
  type IssueViewModel,
  type AdjustmentType,
} from './reconciliation.types';

const props = defineProps<{
  row: IssueViewModel | null;
  visible: boolean;
  actor: Actor;
  historical: boolean;
}>();
const emit = defineEmits<{ close: []; step: [step: number] }>();
const store = useReconciliation(),
  toast = useToast();
const type = ref<AdjustmentType>('ADD_OUT'),
  newIn = ref(''),
  newOut = ref(''),
  minutes = ref<number | null>(480),
  explanation = ref('');
const error = ref(''),
  discard = ref(false),
  baseline = ref('');
const localInput = (value: string) => {
  const date = new Date(value),
    pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const asIso = (value: string) =>
  value && Number.isFinite(new Date(value).getTime()) ? new Date(value).toISOString() : null;
const signature = () =>
  JSON.stringify([type.value, newIn.value, newOut.value, minutes.value, explanation.value]);
watch(
  () => props.row?.issue.id,
  () => {
    if (!props.row) return;
    type.value = props.row.context.expectedType;
    newIn.value = localInput(props.row.shift.start);
    newOut.value = localInput(props.row.shift.end);
    minutes.value = props.row.context.expectedMinutes ?? props.row.shift.standardMinutes;
    explanation.value = '';
    error.value = '';
    baseline.value = signature();
  },
  { immediate: true },
);
const adjustment = computed(() => props.row?.pendingAdjustment);
const dirty = computed(() => signature() !== baseline.value);
const editable = computed(
  () =>
    !!props.row &&
    props.actor.role !== 'Payroll' &&
    !props.historical &&
    store.state.periods.find(
      (p) =>
        p.id ===
        store.state.runs.find((r) => r.id === props.row!.issue.doiSoatCongId)?.kyChamCongId,
    )?.trangThai !== 'CLOSED' &&
    (props.actor.role !== 'HOD' || props.actor.departmentCode === props.row.issue.maBoPhan) &&
    !store.state.runs.some(
      (r) =>
        r.kyChamCongId ===
          store.state.runs.find((r) => r.id === props.row!.issue.doiSoatCongId)?.kyChamCongId &&
        r.trangThai === 'RUNNING',
    ),
);
const canPropose = computed(
  () =>
    editable.value &&
    ['OPEN', 'IN_REVIEW'].includes(props.row!.issue.trangThai) &&
    (!adjustment.value ||
      ['REJECTED', 'CANCELLED', 'APPLIED'].includes(adjustment.value.trangThai)),
);
const events = computed(() =>
  store.state.audit
    .filter((e) => e.issueKey === props.row?.issue.issueKey)
    .slice()
    .reverse(),
);
const allAdjustments = computed(() => {
  const ids = new Set(
    store.state.issues.filter((i) => i.issueKey === props.row?.issue.issueKey).map((i) => i.id),
  );
  return store.state.adjustments
    .filter((a) => ids.has(a.doiSoatChiTietId))
    .slice()
    .reverse();
});
function perform(action: () => unknown, message: string) {
  error.value = '';
  try {
    action();
    explanation.value = '';
    baseline.value = signature();
    toast.info(`${message} — chưa lưu lên hệ thống`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}
function submit() {
  if (!props.row) return;
  perform(
    () =>
      store.submitAdjustment(
        props.row!.issue.id,
        {
          type: type.value,
          reason: explanation.value,
          newIn: asIso(newIn.value),
          newOut: asIso(newOut.value),
          minutes: minutes.value,
        },
        props.actor,
      ),
    'Đã gửi đề xuất mô phỏng',
  );
}
function close() {
  if (dirty.value) discard.value = true;
  else emit('close');
}
onBeforeRouteLeave(
  () =>
    !dirty.value || window.confirm('Nội dung đề xuất chưa lưu sẽ bị bỏ. Bạn có muốn rời trang?'),
);
defineExpose({ dirty });
</script>

<template>
  <AppDrawer
    :visible="visible"
    position="right"
    header="Xem & xử lý bất thường"
    class="recon-overlay recon-drawer"
    :style="{ width: 'min(620px, 100vw)' }"
    :modal="true"
    :dismissable="false"
    @update:visible="
      (value) => {
        if (!value) close();
      }
    "
  >
    <template v-if="row">
      <div class="rc-demo-line">
        <i class="pi pi-info-circle" />{{ DEMO_NOTICE }}
      </div>
      <div class="rc-drawer-person">
        <span class="rc-avatar">{{
          row.employeeName
            .split(' ')
            .slice(-2)
            .map((s) => s[0])
            .join('')
        }}</span>
        <div>
          <h2>{{ row.employeeName }}</h2>
          <p>{{ row.issue.maNhanVien }} · {{ row.departmentName }}</p>
        </div>
        <span class="rc-badge neutral">{{ issueLabels[row.issue.trangThai] }}</span>
      </div>
      <div
        class="rc-drawer-alert"
        :class="row.issue.mucDo === 'CRITICAL' ? 'danger' : 'warning'"
      >
        <i class="pi pi-exclamation-circle" />
        <div>
          <strong>{{ row.issue.maLoi }} · {{ row.issue.moTa }}</strong>
          <p>
            {{ formatDate(row.issue.ngayCong) }} · {{ row.shift.shift }} ·
            {{ row.issue.phanCongCaId ? 'Phân công #' + row.issue.phanCongCaId : 'Chưa phân ca' }}
          </p>
        </div>
      </div>
      <p
        v-if="!editable"
        class="rc-notice"
      >
        <i class="pi pi-lock" />Chỉ xem: kỳ đã chốt, vai trò không có quyền, đang đối soát hoặc đây
        là kết quả lịch sử.
      </p>
      <p
        v-if="row.isStale"
        class="rc-notice"
      >
        <i class="pi pi-history" />Kết quả cũ. Sau khi áp dụng, cần tính lại và chạy đối soát để
        kiểm chứng.
      </p>
      <AppButton
        v-if="editable && row.issue.trangThai === 'OPEN'"
        label="Bắt đầu xác minh"
        icon="pi pi-search"
        severity="secondary"
        outlined
        @click="
          perform(() => store.beginReview(row!.issue.id, actor), 'Đã bắt đầu xác minh mô phỏng')
        "
      />
      <section class="rc-drawer-section">
        <h3>Dòng thời gian ca làm việc</h3>
        <div class="rc-shift-timeline">
          <div>
            <i class="pi pi-sign-in" /><strong>{{ formatTime(row.shift.start) }}</strong><small>{{ formatDate(row.shift.start) }}</small><span>Bắt đầu ca</span>
          </div>
          <span class="rc-timeline-line" />
          <div>
            <i class="pi pi-sign-out" /><strong>{{ formatTime(row.shift.end) }}</strong><small>{{ formatDate(row.shift.end) }}</small><span>Kết thúc ca</span>
          </div>
        </div>
        <div class="rc-comparison">
          <div>
            <small>IN gốc · chỉ đọc</small><strong>{{ formatStamp(row.shift.originalIn) }}</strong>
          </div>
          <div>
            <small>OUT gốc · chỉ đọc</small><strong>{{ formatStamp(row.shift.originalOut) }}</strong>
          </div>
        </div>
        <p
          v-if="row.context.extraLogs.length"
          class="rc-muted"
        >
          Log bổ sung: {{ row.context.extraLogs.map(formatStamp).join(' / ') }}
        </p>
      </section>
      <section class="rc-drawer-section">
        <h3>Đối chiếu dữ liệu</h3>
        <div class="rc-comparison">
          <div>
            <small>Giá trị dự kiến</small><strong>{{ row.issue.giaTriDuKien }}</strong>
          </div>
          <div>
            <small>Kết quả hiện tại</small><strong>{{ row.issue.giaTriThucTe }}</strong>
          </div>
        </div>
        <div class="rc-context-grid">
          <div>
            <i class="pi pi-calendar" /><strong>Phân ca</strong>
            <p>{{ row.context.assignment }}</p>
          </div>
          <div>
            <i class="pi pi-calendar-minus" /><strong>Nghỉ phép</strong>
            <p>{{ row.context.leave }}</p>
          </div>
          <div>
            <i class="pi pi-clock" /><strong>Tăng ca</strong>
            <p>{{ row.context.overtime }}</p>
          </div>
          <div>
            <i class="pi pi-sun" /><strong>Ngày lễ</strong>
            <p>{{ row.context.holiday }}</p>
          </div>
        </div>
      </section>
      <section
        v-if="adjustment"
        class="rc-drawer-section"
      >
        <h3>
          Đề xuất gần nhất
          <span class="rc-badge info">{{ adjustmentLabels[adjustment.trangThai] }}</span>
        </h3>
        <div class="rc-comparison">
          <div>
            <small>{{ adjustmentTypes[adjustment.loaiDieuChinh] }}</small><strong>{{
              adjustment.gioInMoi
                ? formatStamp(adjustment.gioInMoi)
                : adjustment.gioOutMoi
                  ? formatStamp(adjustment.gioOutMoi)
                  : adjustment.soPhutDieuChinh + ' phút'
            }}</strong>
          </div>
          <div>
            <small>Lý do đề xuất</small><strong>{{ adjustment.lyDo }}</strong>
          </div>
        </div>
        <p class="rc-meta">
          Đề xuất: {{ adjustment.nguoiDeXuat }} · {{ formatStamp(adjustment.deXuatLuc)
          }}<br>Duyệt: {{ adjustment.nguoiDuyet || 'Chưa duyệt' }} ·
          {{ formatStamp(adjustment.duyetLuc) }}<br>Áp dụng:
          {{ adjustment.appliedBy || 'Chưa áp dụng' }} · {{ formatStamp(adjustment.appliedAt) }}
        </p>
        <p
          v-if="adjustment.lyDoTuChoi"
          class="rc-text-warning"
        >
          Lý do từ chối: {{ adjustment.lyDoTuChoi }}
        </p>
        <p
          v-if="adjustment.trangThai === 'APPLIED'"
          class="rc-notice"
        >
          Đã áp dụng vào bản tính mô phỏng. Bất thường chỉ được giải quyết sau tính lại và đối soát
          lại.
        </p>
      </section>
      <form
        v-if="
          editable &&
            (canPropose ||
              adjustment?.trangThai === 'PENDING' ||
              ['OPEN', 'IN_REVIEW'].includes(row.issue.trangThai))
        "
        class="rc-drawer-section rc-form"
        @submit.prevent="submit"
      >
        <h3>{{ canPropose ? 'Đề xuất điều chỉnh' : 'Xác nhận xử lý' }}</h3>
        <template v-if="canPropose">
          <label><span>Loại điều chỉnh</span><select v-model="type">
            <option
              v-for="(label, value) in adjustmentTypes"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select></label>
          <p
            v-if="type === 'CHANGE_SHIFT' || type === 'OTHER'"
            class="rc-notice"
          >
            Loại này chỉ xem xét trong Phase 0; chưa có trường dữ liệu đích để áp dụng. Hãy ghi nhận
            trong lý do và chọn điều chỉnh phút công nếu phù hợp.
          </p>
          <label v-if="type === 'ADD_IN' || type === 'CHANGE_IN'"><span>Giờ IN đề xuất (giờ địa phương)</span><input
            v-model="newIn"
            type="datetime-local"
            required
          ></label>
          <label v-if="type === 'ADD_OUT' || type === 'CHANGE_OUT'"><span>Giờ OUT đề xuất (giờ địa phương)</span><input
            v-model="newOut"
            type="datetime-local"
            required
          ></label>
          <label v-if="type === 'WORK_MINUTES'"><span>Số phút công đề xuất</span><input
            v-model.number="minutes"
            type="number"
            min="0"
            :max="row.shift.standardMinutes"
            step="1"
            required
          ></label>
        </template>
        <label><span>Lý do điều chỉnh / giải trình <b class="rc-required">*</b></span><textarea
          v-model="explanation"
          rows="3"
          placeholder="Ghi rõ căn cứ xác nhận hoặc lý do từ chối (ít nhất 8 ký tự)…"
        />
        </label>
        <p
          v-if="error"
          class="rc-error"
          role="alert"
        >
          {{ error }}
        </p>
        <div class="rc-actions">
          <AppButton
            v-if="canPropose"
            type="submit"
            label="Lưu đề xuất & gửi duyệt"
            icon="pi pi-send"
            :disabled="type === 'CHANGE_SHIFT' || type === 'OTHER'"
          /><AppButton
            v-if="adjustment?.trangThai === 'PENDING'"
            label="Phê duyệt đề xuất"
            icon="pi pi-check"
            @click="
              perform(() => store.approveAdjustment(adjustment!.id, actor), 'Đã phê duyệt mô phỏng')
            "
          /><AppButton
            v-if="adjustment?.trangThai === 'PENDING'"
            label="Từ chối"
            severity="danger"
            outlined
            @click="
              perform(
                () => store.rejectAdjustment(adjustment!.id, explanation, actor),
                'Đã từ chối mô phỏng',
              )
            "
          />
        </div>
        <AppButton
          v-if="canPropose && row.issue.mucDo !== 'CRITICAL'"
          label="Đánh dấu không cần điều chỉnh"
          severity="secondary"
          text
          @click="
            perform(
              () => store.acceptIssue(row!.issue.id, explanation, actor),
              'Đã xác nhận ngoại lệ mô phỏng',
            )
          "
        />
      </form>
      <div
        v-if="editable && adjustment?.trangThai === 'APPROVED'"
        class="rc-drawer-section"
      >
        <AppButton
          label="Áp dụng điều chỉnh mô phỏng"
          icon="pi pi-check-circle"
          @click="
            perform(
              () => store.applyAdjustment(adjustment!.id, actor),
              'Đã áp dụng mô phỏng; cần tính lại',
            )
          "
        />
        <p
          v-if="error"
          class="rc-error"
          role="alert"
        >
          {{ error }}
        </p>
      </div>
      <AppButton
        v-if="editable && adjustment?.trangThai === 'APPLIED'"
        label="Đến bước tính lại & đối soát"
        icon="pi pi-arrow-right"
        outlined
        @click="dirty ? close() : (emit('close'), emit('step', 2))"
      />
      <section class="rc-drawer-section">
        <h3>Lịch sử xử lý</h3>
        <ul class="rc-audit-list">
          <li
            v-for="event in events"
            :key="event.id"
          >
            <i class="pi pi-circle-fill" />
            <div>
              <strong>{{ event.message }}</strong><small>{{ event.actor }} · {{ formatStamp(event.at) }}</small>
            </div>
          </li>
          <li v-if="!events.length">
            <i class="pi pi-circle-fill" />
            <div>
              <strong>Phát hiện trong lần đối soát
                {{
                  store.state.runs.find((r) => r.id === row!.issue.doiSoatCongId)?.lanChay
                }}</strong><small>{{ formatStamp(row.issue.createdAt) }}</small>
            </div>
          </li>
        </ul>
        <details v-if="allAdjustments.length > 1">
          <summary>Tất cả đề xuất ({{ allAdjustments.length }})</summary>
          <p
            v-for="a in allAdjustments"
            :key="a.id"
          >
            #{{ a.id }} · {{ adjustmentLabels[a.trangThai] }} · {{ a.lyDo }}
          </p>
        </details>
        <p
          v-if="row.issue.ghiChuXuLy"
          class="rc-notice"
        >
          Giải trình: {{ row.issue.ghiChuXuLy }}
        </p>
      </section>
    </template>
  </AppDrawer>
  <AppDialog
    :visible="discard"
    header="Bỏ nội dung chưa gửi?"
    modal
    class="recon-overlay"
    :style="{ width: 'min(440px, 95vw)' }"
    @update:visible="discard = $event"
  >
    <p>Đề xuất chưa được gửi. Bạn có thể quay lại để tiếp tục nhập.</p>
    <div class="rc-actions">
      <AppButton
        label="Tiếp tục nhập"
        severity="secondary"
        outlined
        @click="discard = false"
      /><AppButton
        label="Bỏ nội dung & đóng"
        severity="danger"
        @click="
          discard = false;
          baseline = signature();
          emit('close');
        "
      />
    </div>
  </AppDialog>
</template>
