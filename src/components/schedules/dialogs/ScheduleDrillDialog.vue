<script setup lang="ts">
import Dialog from 'primevue/dialog';
import type { Assignment } from '@/types/schedule';

const open = defineModel<boolean>('open', { required: true });
defineProps<{
  assignments: Assignment[];
  name: (id: string) => string;
  fmt: (date: string) => string;
  label: (assignment?: Assignment) => string;
}>();
</script>

<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Lịch chi tiết"
    :style="{ width: '800px', maxWidth: '95vw' }"
  >
    <div class="table-scroll schedule-dialog">
      <table class="report">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Ngày</th>
            <th>Phân công</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assignment in assignments" :key="assignment.id">
            <td>{{ name(assignment.employeeId) }}</td>
            <td>{{ fmt(assignment.date) }}</td>
            <td>{{ label(assignment) }}</td>
          </tr>
          <tr v-if="!assignments.length">
            <td colspan="3">Chưa có lịch phù hợp.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Dialog>
</template>
