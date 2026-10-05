<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import type { RecruitmentRecord } from '@/types/recruitment';
import { contractDate } from '@/utils/contract';

const props = defineProps<{ record: RecruitmentRecord; busy?: boolean }>();
const page = ref<HTMLElement>();
const error = ref('');
const money = (value: number | null) => value == null
  ? 'Chưa có thông tin'
  : new Intl.NumberFormat('vi-VN').format(value) + ' VND/tháng';

function printLetter() {
  if (props.busy || props.record.trangThai !== '5' || !page.value) return;
  error.value = '';
  const popup = window.open('', '_blank', 'width=850,height=900');
  if (!popup) {
    error.value = 'Vui lòng cho phép cửa sổ bật lên và nhấn in lại.';
    return;
  }
  try {
    popup.opener = null;
    popup.document.documentElement.lang = 'vi';
    popup.document.title = 'Thư mời nhận việc - ' + props.record.hoTen;
    const style = popup.document.createElement('style');
    style.textContent = `
      @page { size: A4; margin: 20mm; }
      body { margin: 0; color: #111; background: white; font: 14px Arial, sans-serif; line-height: 1.65; }
      article { max-width: 170mm; margin: 0 auto; }
      h1 { text-align: center; font-size: 23px; margin: 28px 0; }
      .letter-date { text-align: right; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #aaa; padding: 9px 12px; text-align: left; overflow-wrap: anywhere; }
      th { width: 42%; font-weight: 600; }
      tr, .letter-signatures { break-inside: avoid; }
      .letter-signatures { display: flex; justify-content: space-between; gap: 24px; margin-top: 40px; text-align: center; }
      .letter-signatures > div { flex: 1; min-height: 110px; }
      .letter-signatures p { margin: 0; }
      @media screen { body { padding: 30px; } }
    `;
    popup.document.head.append(style);
    const content = page.value.cloneNode(true) as HTMLElement;
    const date = content.querySelector('[data-letter-date]');
    if (date) date.textContent = 'Ngày ' + new Intl.DateTimeFormat('vi-VN').format(new Date());
    popup.document.body.replaceChildren(content);
    popup.document.close();
    popup.focus();
    popup.print();
  } catch {
    error.value = 'Không thể mở bản in. Vui lòng thử lại.';
    popup.close();
  }
}
</script>

<template>
  <div
    v-if="record.trangThai === '5'"
    class="offer-letter-action"
  >
    <AppButton
      label="Tạo và in thư mời nhận việc"
      icon="pi pi-print"
      :disabled="busy"
      @click="printLetter"
    />
    <p
      v-if="error"
      role="alert"
      class="field-error"
    >
      {{ error }}
    </p>
    <div
      hidden
      aria-hidden="true"
    >
      <article ref="page">
        <p
          class="letter-date"
          data-letter-date
        />
        <h1>THƯ MỜI NHẬN VIỆC</h1>
        <p>Kính gửi: <strong>{{ record.hoTen }}</strong></p>
        <p>Chúng tôi trân trọng mời Anh/Chị nhận việc với các thông tin đã thỏa thuận như sau:</p>
        <table>
          <tbody>
            <tr><th>Họ và tên</th><td>{{ record.hoTen }}</td></tr>
            <tr><th>Chức vụ</th><td>{{ record.tenChucVuDuKien || 'Chưa có thông tin' }}</td></tr>
            <tr><th>Bộ phận</th><td>{{ record.tenBoPhanDuKien || 'Chưa có thông tin' }}</td></tr>
            <tr><th>Ngày nhận việc</th><td>{{ contractDate(record.ngayBatDauLamViec) }}</td></tr>
            <tr><th>Tổng thu nhập thỏa thuận</th><td>{{ money(record.tongThuNhapThoaThuan) }}</td></tr>
            <tr><th>Lương cơ bản</th><td>{{ money(record.luongCoBan) }}</td></tr>
            <tr><th>Lương thử việc</th><td>{{ money(record.luongThuViec) }}</td></tr>
          </tbody>
        </table>
        <p>Vui lòng liên hệ bộ phận Nhân sự để được hướng dẫn thủ tục nhận việc.</p>
        <p>Chúng tôi mong được chào đón Anh/Chị và cùng hợp tác trong thời gian tới.</p>
        <p>Trân trọng!</p>
        <div class="letter-signatures">
          <div><strong>NGƯỜI NHẬN VIỆC</strong><p><em>(Ký và ghi rõ họ tên)</em></p></div>
          <div><strong>ĐẠI DIỆN ĐƠN VỊ</strong><p><em>(Ký và ghi rõ họ tên)</em></p></div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.field-error { color: #b42318; font-size: 13px; margin: 8px 0 0; }
</style>
