<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AppButton from '@/components/common/AppButton.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import { contractService } from '@/services/modules/contract.service';
import { contractApiError } from '@/utils/contract-api';
import { contractDate, contractStatusLabel } from '@/utils/contract';
import { useContractPermission } from '@/composables/useContractPermission';
import type { ExpiringContract } from '@/types/contract-api';
const router = useRouter(),
  hasPermission = useContractPermission();
const records = ref<ExpiringContract[]>([]),
  total = ref(0),
  loadingExpiry = ref(false),
  error = ref('');
let sequence = 0;
async function load() {
  if (!hasPermission('HOPDONG_VIEW')) return;
  const current = ++sequence;
  loadingExpiry.value = true;
  error.value = '';
  try {
    const result = await contractService.getExpiringContracts();
    if (current === sequence) {
      records.value = result.items;
      total.value = result.totalRecords;
    }
  } catch (e) {
    if (current === sequence) error.value = contractApiError(e);
  } finally {
    if (current === sequence) loadingExpiry.value = false;
  }
}
onBeforeUnmount(() => {
  ++sequence;
});
void load();
</script>
<template>
  <section>
    <div class="page-heading">
      <div>
        <RouterLink to="/contracts">
          Hợp đồng lao động
        </RouterLink>
        <h1>Hợp đồng sắp hết hạn</h1>
        <p>Trong 30 ngày tới · {{ total }} hợp đồng</p>
      </div>
      <AppButton
        label="Tải lại"
        icon="pi pi-refresh"
        :disabled="loadingExpiry"
        @click="load"
      />
    </div>
    <p v-if="!hasPermission('HOPDONG_VIEW')">
      Bạn không có quyền xem hợp đồng.
    </p>
    <AppErrorState
      v-else-if="error"
      :error="error"
      @retry="load"
    />
    <DataTable
      v-else
      :value="records"
      :loading="loadingExpiry"
      data-key="id"
      paginator
      :rows="20"
      :rows-per-page-options="[10, 20, 50]"
      scrollable
    >
      <Column
        field="maNhanVien"
        header="Mã NV"
        sortable
      /><Column
        field="tenNhanVien"
        header="Họ tên"
        sortable
      />
      <Column
        field="soHopDongLaoDong"
        header="Số HĐ"
        sortable
      /><Column
        field="maLoaiHopDong"
        header="Loại HĐ"
        sortable
      />
      <Column
        field="ngayBatDau"
        header="Ngày bắt đầu"
        sortable
      >
        <template #body="{ data }">
          {{ contractDate(data.ngayBatDau) }}
        </template>
      </Column>
      <Column
        field="ngayKetThuc"
        header="Ngày kết thúc"
        sortable
      >
        <template #body="{ data }">
          {{ contractDate(data.ngayKetThuc) }}
        </template>
      </Column>
      <Column
        field="soNgayConLai"
        header="Số ngày còn lại"
        sortable
      >
        <template #body="{ data }">
          <AppStatusBadge
            :label="
              data.soNgayConLai +
                ' ngày · ' +
                (data.soNgayConLai <= 7
                  ? 'Cảnh báo cao'
                  : data.soNgayConLai <= 15
                    ? 'Cảnh báo trung bình'
                    : 'Theo dõi')
            "
            :severity="
              data.soNgayConLai <= 7 ? 'danger' : data.soNgayConLai <= 15 ? 'warning' : 'info'
            "
          />
        </template>
      </Column>
      <Column
        field="trangThaiHopDong"
        header="Trạng thái"
      >
        <template #body="{ data }">
          {{ contractStatusLabel(data.trangThaiHopDong) }}
        </template>
      </Column>
      <Column header="Thao tác">
        <template #body="{ data }">
          <AppButton
            label="Xem hợp đồng"
            text
            @click="router.push('/contracts/' + encodeURIComponent(data.id))"
          />
        </template>
      </Column>
      <template #empty>
        Không có hợp đồng sắp hết hạn.
      </template>
    </DataTable>
  </section>
</template>
