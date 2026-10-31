<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { attendanceNavigation } from '@/constants/attendance';
import AttendanceListView from './AttendanceListView.vue';
import MonthlyAttendancePage from '@/modules/monthly-attendance/MonthlyAttendancePage.vue';
import AttendanceReportsPage from '@/modules/attendance-reports/AttendanceReportsPage.vue';
const route = useRoute();
const current = computed(() => attendanceNavigation.find((item) => item.path === route.path));
</script>
<template>
  <section class="attendance-workspace">
    <nav aria-label="Đường dẫn">
      <RouterLink to="/attendance/overview">Chấm công</RouterLink
      ><span> / {{ current?.label }}</span>
    </nav>
    <template v-if="route.meta.attendancePage === 'daily'"><AttendanceListView /></template>
    <template v-else-if="route.meta.attendancePage === 'monthly'"
      ><MonthlyAttendancePage
    /></template>
    <template v-else-if="route.meta.attendancePage === 'reports'"
      ><AttendanceReportsPage
    /></template>
    <template v-else>
      <h1>{{ current?.label }}</h1>
      <div class="workspace-empty">
        <i :class="['pi', current?.icon]" />
        <h2>Chưa có dữ liệu {{ current?.label.toLocaleLowerCase() }}</h2>
        <p>
          Chức năng đã được tách riêng trong module Chấm công. Chưa kết nối nguồn dữ liệu cho màn
          hình này.
        </p>
        <RouterLink to="/attendance/overview">← Về tổng quan chấm công</RouterLink>
      </div>
    </template>
  </section>
</template>
<style scoped>
nav {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 18px;
}
h1 {
  font-size: 24px;
}
.workspace-empty {
  text-align: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 70px 20px;
  margin-top: 24px;
}
.workspace-empty > i {
  font-size: 36px;
  color: #4387df;
}
.workspace-empty h2 {
  font-size: 18px;
  margin-top: 20px;
}
.workspace-empty p {
  color: #64748b;
  margin: 14px 0 24px;
}
</style>
