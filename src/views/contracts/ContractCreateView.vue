<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import AppButton from '@/components/common/AppButton.vue';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import ContractForm from '@/components/contracts/ContractForm.vue';
import ContractAllowanceTable from '@/components/contracts/ContractAllowanceTable.vue';
import ContractProposalPreview from '@/components/contracts/ContractProposalPreview.vue';
import { contractService } from '@/services/modules/contract.service';
import { contractApiError, ContractApiError } from '@/utils/contract-api';
import { contractDate, contractMoney, contractStatusLabel } from '@/utils/contract';
import { useContractPermission } from '@/composables/useContractPermission';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import type { ContractDto, CreateContractInput } from '@/types/contract-api';
const props = withDefaults(defineProps<{ mode?: 'INSERT' | 'READ'; contractId?: string }>(), {
  mode: 'INSERT',
  contractId: '',
});
const emit = defineEmits<{ changed: []; busy: [boolean] }>();
const readonly = computed(() => props.mode === 'READ');
const hasPermission = useContractPermission(),
  toast = useToast(),
  router = useRouter(),
  confirm = useConfirm();
const allowed = computed(() => hasPermission(readonly.value ? 'HOPDONG_VIEW' : 'HOPDONG_CREATE'));
const detail = ref<ContractDto>();
const loadingDetail = ref(false),
  saving = ref(false),
  changingStatus = ref(false),
  proposalVisible = ref(false),
  dirty = ref(false);
const createdId = ref('');
const creationConfirmed = ref(false);
const busy = computed(() => saving.value || changingStatus.value);
const error = ref('');
let sequence = 0;
const readFields = computed(() => {
  const item = detail.value;
  if (!item) return [];
  return [
    ['Mã hợp đồng', item.id],
    ['Mã nhân viên', item.maNhanVien],
    ['Nhân viên', item.tenNhanVien],
    ['Số hợp đồng', item.soHopDongLaoDong],
    ['Loại hợp đồng', item.tenLoaiHopDong || item.maLoaiHopDong],
    ['Chức vụ', item.tenChucVu || item.maChucVu],
    ['Ngày ký', contractDate(item.ngayKyHopDong)],
    ['Ngày bắt đầu', contractDate(item.ngayBatDau)],
    ['Ngày kết thúc', contractDate(item.ngayKetThuc || null)],
    ['Lương cơ bản', contractMoney(item.luongCoBan)],
    ['Mức đóng BHXH', contractMoney(item.mucDongBHXH ?? null)],
    ['Lương phụ cấp', contractMoney(item.luongPhuCap ?? null)],
    ['Tổng thu nhập', contractMoney(item.tongThuNhap)],
    ['Lương thử việc', contractMoney(item.luongThuViec)],
    ['Ngày duyệt', contractDate(item.ngayDuyetHopDong || null)],
    ['Người ký duyệt', item.nguoiKyDuyet],
    ['Trạng thái', contractStatusLabel(item.trangThaiHopDong, item.tenTrangThaiHopDong)],
    ['Ghi chú', item.ghiChu],
  ];
});
async function load() {
  const current = ++sequence;
  detail.value = undefined;
  error.value = '';
  if (!readonly.value || !allowed.value) {
    loadingDetail.value = false;
    return;
  }
  loadingDetail.value = true;
  try {
    const item = await contractService.getById(props.contractId);
    if (current === sequence) detail.value = item;
  } catch (e) {
    if (current === sequence) {
      error.value = contractApiError(e);
      toast.error(error.value);
    }
  } finally {
    if (current === sequence) loadingDetail.value = false;
  }
}
watch(
  () => [props.mode, props.contractId, allowed.value],
  () => {
    proposalVisible.value = false;
    void load();
  },
  { immediate: true },
);
watch(busy, (value) => emit('busy', value));
onBeforeUnmount(() => {
  ++sequence;
});
async function save(input: CreateContractInput) {
  if (busy.value || readonly.value || !allowed.value || creationConfirmed.value) return;
  saving.value = true;
  error.value = '';
  try {
    const result = await contractService.create(input);
    if (!result.success) {
      error.value = result.message;
      toast.error(result.message);
      return;
    }
    creationConfirmed.value = true;
    dirty.value = false;
    if (!result.data?.id)
      throw new ContractApiError(
        'Máy chủ chưa trả về mã hợp đồng. Vui lòng kiểm tra danh sách trước khi tạo lại.',
      );
    createdId.value = result.data.id;
    dirty.value = false;
    toast.success(result.message);
  } catch (e) {
    error.value = contractApiError(e);
    toast.error(error.value);
  } finally {
    saving.value = false;
  }
  if (createdId.value) await router.push('/contracts/' + encodeURIComponent(createdId.value));
}
async function changed() {
  await load();
  emit('changed');
}
async function changeStatus(next: '2' | '3') {
  const item = detail.value;
  if (busy.value || !readonly.value || !allowed.value || !item) return;
  if (
    (next === '2' && item.trangThaiHopDong !== '1') ||
    (next === '3' && item.trangThaiHopDong !== '2')
  )
    return;

  changingStatus.value = true;
  error.value = '';
  try {
    const result = await contractService.changeStatus(item.id, next);
    if (!result.success) {
      error.value = result.message;
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    await changed();
  } catch (e) {
    error.value = contractApiError(e);
    toast.error(error.value);
  } finally {
    changingStatus.value = false;
  }
}
onBeforeRouteLeave(() => {
  if (busy.value) return false;
  if (readonly.value || !dirty.value) return true;
  return new Promise<boolean>((resolve) =>
    confirm(() => resolve(true), {
      message: 'Các thay đổi chưa lưu sẽ bị mất. Bạn muốn rời màn hình?',
      acceptLabel: 'Rời màn hình',
      reject: () => resolve(false),
    }),
  );
});
</script>
<template>
  <section class="contract-page">
    <div v-if="!readonly" class="page-heading">
      <div>
        <RouterLink to="/contracts"> Hợp đồng lao động </RouterLink>
        <h1>Tạo hợp đồng lao động</h1>
      </div>
    </div>
    <p v-if="!allowed" role="alert">Bạn không có quyền thực hiện thao tác này.</p>
    <template v-else>
      <AppLoading v-if="loadingDetail" />
      <AppErrorState v-else-if="readonly && error" :error="error" @retry="load" />
      <template v-else-if="readonly && detail">
        <div class="summary-card">
          <h2>{{ detail.soHopDongLaoDong }}</h2>
          <p>{{ detail.tenNhanVien || detail.maNhanVien }}</p>
          <AppStatusBadge
            :label="contractStatusLabel(detail.trangThaiHopDong, detail.tenTrangThaiHopDong)"
            severity="info"
          />
        </div>
        <section class="profile-panel">
          <h2>Thông tin hợp đồng</h2>
          <dl class="read-fields">
            <div v-for="[label, value] in readFields" :key="label">
              <dt>{{ label }}</dt>
              <dd>{{ value || '—' }}</dd>
            </div>
          </dl>
        </section>
        <ContractAllowanceTable :model-value="detail.phuCaps || []" readonly />
        <div class="contract-actions">
          <AppButton
            label="Xem và in tờ trình ký hợp đồng"
            icon="pi pi-print"
            severity="secondary"
            outlined
            :disabled="busy || loadingDetail"
            @click="proposalVisible = true"
          />
          <AppButton
            v-if="detail.trangThaiHopDong === '1' && hasPermission('HOPDONG_STATUS_UPDATE')"
            label="Ký hợp đồng"
            icon="pi pi-pencil"
            :loading="changingStatus"
            :disabled="busy || loadingDetail"
            @click="changeStatus('2')"
          />
          <AppButton
            v-else-if="detail.trangThaiHopDong === '2' && hasPermission('HOPDONG_STATUS_UPDATE')"
            label="Phát hành hợp đồng"
            icon="pi pi-send"
            :loading="changingStatus"
            :disabled="busy || loadingDetail"
            @click="changeStatus('3')"
          />
        </div>
        <ContractProposalPreview
          :record="proposalVisible ? detail : null"
          @close="proposalVisible = false"
        />
      </template>
      <template v-else-if="!readonly">
        <p v-if="error" role="alert" class="field-error">
          {{ error }}
        </p>
        <RouterLink v-if="createdId" :to="'/contracts/' + encodeURIComponent(createdId)">
          Xem hợp đồng vừa tạo
        </RouterLink>
        <ContractForm
          v-else-if="!creationConfirmed"
          :saving="saving"
          @submit="save"
          @dirty="dirty = $event"
        />
      </template>
    </template>
  </section>
</template>
<style scoped>
.contract-page {
  max-width: 1200px;
  min-width: 0;
  margin: 0 auto;
}
.page-heading {
  margin-bottom: 24px;
}
.page-heading a {
  color: #0067c0;
  font-size: 12px;
}
.page-heading h1 {
  margin: 10px 0 0;
  font-size: 26px;
  font-weight: 600;
}

.contract-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.read-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
dt {
  color: #64748b;
  font-size: 12px;
}
dd {
  margin: 6px 0 0;
  overflow-wrap: anywhere;
}
.field-error {
  color: #b42318;
}
@media (max-width: 600px) {
  .read-fields {
    grid-template-columns: 1fr;
  }
}
</style>
