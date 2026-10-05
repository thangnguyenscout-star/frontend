<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import { contractDate, contractMoney } from '@/utils/contract';
import type { ContractDto } from '@/types/contract-api';
defineProps<{ record: ContractDto | null }>();
const emit = defineEmits<{ close: [] }>();
const page = ref<HTMLElement>();
const error = ref('');
function print() {
  const popup = window.open('', '_blank', 'width=850,height=900');
  if (!popup || !page.value) {
    error.value = 'Vui lòng cho phép cửa sổ in trên trình duyệt.';
    return;
  }
  popup.document.title = 'Tờ trình ký hợp đồng lao động';
  const style = popup.document.createElement('style');
  style.textContent =
    'body{font:14px Arial,sans-serif;line-height:1.7;padding:36px;color:#111}h2,h3{text-align:center}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}.proposal-signature{text-align:right;margin-top:40px}';
  popup.document.head.append(style);
  popup.document.body.append(page.value.cloneNode(true));
  popup.document.close();
  popup.focus();
  popup.print();
}
</script>
<template>
  <Dialog
    :visible="!!record"
    modal
    header="Xem trước tờ trình"
    :style="{ width: '820px', maxWidth: '95vw' }"
    @update:visible="!$event && emit('close')"
  >
    <article
      v-if="record"
      ref="page"
      class="proposal-page"
    >
      <h2>TỜ TRÌNH</h2>
      <h3>Về việc ký hợp đồng lao động</h3>
      <p>Kính gửi: Ban lãnh đạo</p>
      <p>Đề nghị xem xét và phê duyệt hợp đồng lao động với các thông tin sau:</p>
      <table>
        <tbody>
          <tr>
            <th>Số hợp đồng</th>
            <td>{{ record.soHopDongLaoDong }}</td>
          </tr>
          <tr>
            <th>Nhân viên</th>
            <td>{{ record.maNhanVien }} — {{ record.tenNhanVien || record.maNhanVien }}</td>
          </tr>
          <tr>
            <th>Loại hợp đồng</th>
            <td>{{ record.tenLoaiHopDong }}</td>
          </tr>
          <tr>
            <th>Chức vụ</th>
            <td>{{ record.tenChucVu || record.maChucVu || '—' }}</td>
          </tr>
          <tr>
            <th>Ngày ký</th>
            <td>{{ contractDate(record.ngayKyHopDong) }}</td>
          </tr>
          <tr>
            <th>Thời hạn</th>
            <td>
              {{ contractDate(record.ngayBatDau) }} — {{ contractDate(record.ngayKetThuc || null) }}
            </td>
          </tr>
          <tr>
            <th>Lương cơ bản</th>
            <td>{{ contractMoney(record.luongCoBan) }} VND</td>
          </tr>
          <tr>
            <th>Tổng thu nhập</th>
            <td>{{ contractMoney(record.tongThuNhap) }} VND</td>
          </tr>
          <tr>
            <th>Tổng phụ cấp</th>
            <td>{{ contractMoney(record.luongPhuCap ?? 0) }} VND</td>
          </tr>
          <tr>
            <th>Lương thử việc (85%)</th>
            <td>{{ contractMoney(record.luongThuViec) }} VND</td>
          </tr>
          <tr>
            <th>Mức đóng BHXH (8%)</th>
            <td>{{ contractMoney(record.mucDongBHXH ?? null) }} VND</td>
          </tr>
        </tbody>
      </table>
      <h3>Các khoản phụ cấp</h3>
      <table>
        <thead>
          <tr>
            <th>Phụ cấp</th>
            <th>Số tiền</th>
            <th>Tỷ lệ</th>
            <th>Mức tính</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in record.phuCaps || []"
            :key="row.maPhuCap"
          >
            <td>{{ row.tenPhuCap || row.maPhuCap }}</td>
            <td>{{ contractMoney(row.soTien) }} VND</td>
            <td>
              {{ row.tyLe == null ? '—' : row.tyLe + '%' }}
            </td>
            <td>
              {{ row.mucTinh == null ? '—' : contractMoney(row.mucTinh) + ' VND' }}
            </td>
            <td>
              {{ row.ghiChu || '—' }}
            </td>
          </tr>
          <tr v-if="!record.phuCaps?.length">
            <td colspan="5">
              Không có phụ cấp.
            </td>
          </tr>
        </tbody>
      </table>
      <p>Ghi chú: {{ record.ghiChu || '—' }}</p>
      <p class="proposal-signature">
        Người lập tờ trình<br>
        <small>(Ký và ghi rõ họ tên)</small>
      </p>
    </article>
    <p
      v-if="error"
      class="field-error"
      role="alert"
    >
      {{ error }}
    </p>
    <template #footer>
      <AppButton
        label="Đóng"
        severity="secondary"
        outlined
        @click="emit('close')"
      />
      <AppButton
        label="In tờ trình"
        icon="pi pi-print"
        @click="print"
      />
    </template>
  </Dialog>
</template>
<style scoped>
.proposal-page {
  padding: 20px;
  font-size: 14px;
  line-height: 1.7;
}
.proposal-page h2,
.proposal-page h3 {
  text-align: center;
}
.proposal-page table {
  width: 100%;
  border-collapse: collapse;
}
.proposal-page td,
.proposal-page th {
  border: 1px solid #e2e8f0;
  padding: 8px;
  text-align: left;
}
.proposal-signature {
  text-align: right;
  margin-top: 40px;
}
</style>
