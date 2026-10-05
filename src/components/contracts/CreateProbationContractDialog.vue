<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import ContractForm from './ContractForm.vue';
import { contractService } from '@/services/modules/contract.service';
import { recruitmentService } from '@/services/modules/recruitment.service';
import {
  contractApiError,
  ContractApiError,
  emptyContractForm,
  buildProbationContractInput,
} from '@/utils/contract-api';
import { contractDate, contractStatusLabel } from '@/utils/contract';
import { genderLabels } from '@/utils/recruitment';
import { useContractPermission } from '@/composables/useContractPermission';
import { useToast } from '@/composables/useToast';
import type { CreateContractInput, ContractDto } from '@/types/contract-api';
import type { RecruitmentRecord } from '@/types/recruitment';
const props = defineProps<{ visible: boolean; recruitmentId: string }>();
const emit = defineEmits<{ 'update:visible': [boolean]; created: []; busy: [boolean] }>();
const hasPermission = useContractPermission(),
  toast = useToast(),
  router = useRouter();
const allowed = computed(() => hasPermission('HOPDONG_CREATE'));
const record = ref<RecruitmentRecord>();
const initial = ref<CreateContractInput>();
const result = ref<Pick<ContractDto, 'id' | 'maNhanVien' | 'soHopDongLaoDong' | 'trangThaiHopDong'>>();
const saving = ref(false),
  loadingDetail = ref(false),
  error = ref('');
const completed = ref(false);
let sequence = 0;
async function load() {
  const current = ++sequence;
  record.value = undefined;
  initial.value = undefined;
  result.value = undefined;
  completed.value = false;
  error.value = '';
  if (!props.visible || !allowed.value) {
    loadingDetail.value = false;
    return;
  }
  loadingDetail.value = true;
  try {
    const item = await recruitmentService.getDetail(props.recruitmentId);
    if (current !== sequence) return;
    if (item.trangThai === '5' && item.maNhanVien?.trim()) {
      const soHopDongLaoDong = await contractService.generateProbationContractNumber();
      if (current !== sequence) return;
      initial.value = buildProbationContractInput(
        { ...emptyContractForm(), soHopDongLaoDong },
        item,
      );
    }
    record.value = item;
  } catch (e) {
    if (current === sequence) error.value = contractApiError(e);
  } finally {
    if (current === sequence) loadingDetail.value = false;
  }
}
watch(() => [props.visible, props.recruitmentId], load, { immediate: true });
watch(saving, (value) => emit('busy', value));
onBeforeUnmount(() => {
  ++sequence;
});
onBeforeRouteLeave(() => !saving.value);
function close() {
  if (!saving.value) emit('update:visible', false);
}
async function save(form: CreateContractInput) {
  if (saving.value || completed.value || !allowed.value || record.value?.trangThai !== '5' || !record.value.maNhanVien?.trim()) return;
  saving.value = true;
  error.value = '';
  try {
    const response = await contractService.createProbationFromRecruitment(
      form, record.value.id,
    );
    if (!response.success) {
      error.value = response.message;
      toast.error(response.message);
      return;
    }
    completed.value = true;
    emit('created');
    if (!response.data?.maNhanVien || !response.data.id)
      throw new ContractApiError(
        'Đã tạo thành công nhưng máy chủ chưa trả đủ mã nhân viên/hợp đồng. Vui lòng tải lại danh sách.',
      );
    result.value = response.data;
    toast.success(response.message);
  } catch (e) {
    error.value = contractApiError(e);
    toast.error(error.value);
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <Dialog
    :visible="visible"
    modal
    :header="result ? 'Tạo hợp đồng thử việc thành công' : 'Tạo hợp đồng thử việc'"
    :style="{ width: '1000px', maxWidth: '96vw' }"
    :closable="!saving"
    :close-on-escape="!saving"
    @update:visible="!$event && close()"
  >
    <p
      v-if="!allowed"
      role="alert"
    >
      Bạn cần quyền tạo hợp đồng.
    </p>
    <AppLoading v-else-if="loadingDetail" />
    <template v-else-if="result">
      <dl class="summary">
        <div>
          <dt>Mã nhân viên</dt>
          <dd>{{ result.maNhanVien }}</dd>
        </div>
        <div>
          <dt>Mã hợp đồng</dt>
          <dd>{{ result.id }}</dd>
        </div>
        <div>
          <dt>Số hợp đồng</dt>
          <dd>{{ result.soHopDongLaoDong }}</dd>
        </div>
        <div>
          <dt>Trạng thái</dt>
          <dd>{{ contractStatusLabel(result.trangThaiHopDong) }}</dd>
        </div>
      </dl>
      <div class="dialog-footer">
        <AppButton
          label="Xem hồ sơ nhân viên"
          @click="router.push({ name: 'EmployeeRead', params: { maNhanVien: result.maNhanVien } })"
        />
        <AppButton
          v-if="hasPermission('HOPDONG_VIEW')"
          label="Xem hợp đồng"
          @click="router.push('/contracts/' + encodeURIComponent(result.id))"
        />
      </div>
    </template>
    <template v-else-if="record">
      <h3>Thông tin tiếp nhận</h3>
      <dl class="summary">
        <div>
          <dt>Họ</dt>
          <dd>{{ record.ho }}</dd>
        </div>
        <div>
          <dt>Tên đệm</dt>
          <dd>{{ record.tenDem || '—' }}</dd>
        </div>
        <div>
          <dt>Tên</dt>
          <dd>{{ record.ten }}</dd>
        </div>
        <div>
          <dt>Giới tính</dt>
          <dd>{{ genderLabels[record.gioiTinh] || record.gioiTinh }}</dd>
        </div>
        <div>
          <dt>Điện thoại</dt>
          <dd>{{ record.soDienThoai || '—' }}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{{ record.email || '—' }}</dd>
        </div>
        <div>
          <dt>Bộ phận dự kiến</dt>
          <dd>{{ record.tenBoPhanDuKien }}</dd>
        </div>
        <div>
          <dt>Chức vụ dự kiến</dt>
          <dd>{{ record.tenChucVuDuKien }}</dd>
        </div>
        <div>
          <dt>Ngày bắt đầu làm việc</dt>
          <dd>{{ contractDate(record.ngayBatDauLamViec) }}</dd>
        </div>
      </dl>
      <p
        v-if="error"
        role="alert"
      >
        {{ error }}
      </p>
      <p
        v-if="record.trangThai !== '5'"
        role="alert"
      >
        Hồ sơ tiếp nhận chưa ở trạng thái Đã nhận việc.
      </p>
      <p
        v-else-if="!record.maNhanVien?.trim()"
        role="alert"
      >
        Hồ sơ tiếp nhận chưa có mã nhân viên.
      </p>
      <ContractForm
        v-else-if="!completed"
        :initial="initial"
        :initial-department="record.maBoPhanDuKien"
        probation
        :saving="saving"
        @submit="save"
      />
    </template>
    <AppErrorState
      v-else-if="error"
      :error="error"
      @retry="load"
    />
    <template #footer>
      <AppButton
        label="Đóng"
        severity="secondary"
        :disabled="saving"
        @click="close"
      />
    </template>
  </Dialog>
</template>
<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
dt {
  color: #64748b;
  font-size: 12px;
}
dd {
  margin: 5px 0;
  overflow-wrap: anywhere;
}
[role='alert'] {
  color: #b42318;
}
@media (max-width: 600px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
