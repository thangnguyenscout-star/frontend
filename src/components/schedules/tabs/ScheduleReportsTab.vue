<script setup lang="ts">
import { computed } from 'vue';

interface ReportRow {
  key: string;
  name: string;
  sub: string;
  work: number;
  off: number;
  count: number;
}

const reportMode = defineModel<string>('reportMode', { required: true });
const reportStart = defineModel<string>('reportStart', { required: true });
const reportEnd = defineModel<string>('reportEnd', { required: true });
defineProps<{
  reports: ReportRow[];
  assignmentCount: number;
}>();
const emit = defineEmits<{
  drill: [key: string];
}>();
const invalidRange = computed(() => reportStart.value > reportEnd.value);
</script>

<template>
  <section class="panel form">
    <div class="toolbar">
      <div class="actions">
        <button
          v-for="mode in [
            { id: 'employee', name: 'Theo nhân viên' },
            { id: 'department', name: 'Theo bộ phận' },
            { id: 'shift', name: 'Theo ca' },
          ]"
          :key="mode.id"
          :class="{ chosen: reportMode === mode.id }"
          @click="reportMode = mode.id"
        >
          {{ mode.name }}
        </button>
      </div>
      <label>Từ ngày<input v-model="reportStart" type="date" /></label>
      <label>Đến ngày<input v-model="reportEnd" type="date" /></label>
    </div>
    <p>Tổng hợp từ lịch đã phân công; không tính công, OT hoặc giờ tính lương.</p>
    <p v-if="invalidRange" class="error">Từ ngày không được lớn hơn đến ngày.</p>
    <div v-else class="table-scroll">
      <table class="report">
        <thead>
          <tr>
            <th>
              {{
                reportMode === 'employee'
                  ? 'Nhân viên'
                  : reportMode === 'department'
                    ? 'Bộ phận'
                    : 'Ca'
              }}
            </th>
            <th>{{ reportMode === 'employee' ? 'Ngày làm' : 'Số nhân viên' }}</th>
            <th v-if="reportMode === 'employee'">Ngày nghỉ</th>
            <th>Số phân công</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in reports" :key="row.key">
            <td>
              <strong>{{ row.name }}</strong>
              <small>{{ row.sub }}</small>
            </td>
            <td>{{ row.work }}</td>
            <td v-if="reportMode === 'employee'">{{ row.off }}</td>
            <td>{{ row.count }}</td>
            <td><button @click="emit('drill', row.key)">Xem lịch</button></td>
          </tr>
          <tr v-if="!assignmentCount">
            <td colspan="5" class="empty-state">Chưa có lịch phù hợp trong khoảng ngày đã chọn.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
