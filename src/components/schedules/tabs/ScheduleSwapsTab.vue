<script setup lang="ts">
import type { SwapRequest } from '@/types/schedule';

const swapTab = defineModel<string>('tab', { required: true });
defineProps<{
  rows: SwapRequest[];
  canApprove: boolean;
  canCreate: boolean;
  assignmentLabel: (id: string) => string;
  shiftName: (id: string) => string;
}>();
const emit = defineEmits<{
  create: [];
  detail: [request: SwapRequest];
}>();
const labels: Record<SwapRequest['status'], string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
};
</script>

<template>
  <section class="panel form">
    <div class="toolbar">
      <div class="actions">
        <button :class="{ chosen: swapTab === 'ALL' }" @click="swapTab = 'ALL'">Yêu cầu</button>
        <button
          v-if="canApprove"
          :class="{ chosen: swapTab === 'PENDING' }"
          @click="swapTab = 'PENDING'"
        >
          Chờ tôi duyệt
        </button>
        <button :class="{ chosen: swapTab === 'DONE' }" @click="swapTab = 'DONE'">Đã xử lý</button>
      </div>
      <button v-if="canCreate" class="primary" @click="emit('create')">+ Tạo yêu cầu</button>
    </div>
    <div class="table-scroll">
      <table class="report">
        <thead>
          <tr>
            <th>Mã yêu cầu</th>
            <th>Ca hiện tại</th>
            <th>Đổi với / ca sau đổi</th>
            <th>Lý do</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in rows" :key="request.id">
            <td>{{ request.code }}</td>
            <td>{{ assignmentLabel(request.assignmentId) }}</td>
            <td>
              {{
                request.targetAssignmentId
                  ? assignmentLabel(request.targetAssignmentId)
                  : shiftName(request.shiftId)
              }}
            </td>
            <td>{{ request.reason }}</td>
            <td>{{ new Date(request.createdAt).toLocaleString('vi-VN') }}</td>
            <td>{{ labels[request.status] }}</td>
            <td><button @click="emit('detail', request)">Xem</button></td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="7" class="empty-state">Không có yêu cầu trong trạng thái này.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
