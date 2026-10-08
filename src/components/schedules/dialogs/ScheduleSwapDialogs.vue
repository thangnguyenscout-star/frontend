<script setup lang="ts">
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import type { Assignment, Shift, SwapRequest } from '@/types/schedule';

interface SwapForm {
  assignmentId: string;
  targetAssignmentId: string;
  shiftId: string;
  reason: string;
}

const open = defineModel<boolean>('open', { required: true });
const detailOpen = defineModel<boolean>('detailOpen', { required: true });
const swap = defineModel<SwapForm>('swap', { required: true });
const mode = defineModel<'employee' | 'shift'>('mode', { required: true });
const detail = defineModel<SwapRequest | undefined>('detail');
const decision = defineModel<string>('decision', { required: true });
const props = defineProps<{
  scheduled: Assignment[];
  assignments: Assignment[];
  shifts: Shift[];
  busy: boolean;
  error: string;
  canApprove: boolean;
  assignmentLabel: (id: string) => string;
  shiftName: (id: string) => string;
  swapBefore: (request: SwapRequest, target?: boolean) => string;
  swapAfter: (request: SwapRequest, target?: boolean) => string;
}>();
const emit = defineEmits<{
  send: [];
  decide: [approve: boolean];
}>();
const labels: Record<SwapRequest['status'], string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
};
const selectedAssignment = computed(() =>
  props.assignments.find((assignment) => assignment.id === swap.value.assignmentId),
);
</script>

<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Tạo yêu cầu đổi ca"
    :style="{ width: '650px', maxWidth: '95vw' }"
  >
    <div class="schedule-dialog">
      <label>
        Ca muốn đổi *
        <select v-model="swap.assignmentId">
          <option value="">Chọn ca đã phân công</option>
          <option v-for="assignment in scheduled" :key="assignment.id" :value="assignment.id">
            {{ assignmentLabel(assignment.id) }}
          </option>
        </select>
      </label>
      <label>
        Hình thức
        <select
          v-model="mode"
          @change="
            swap.targetAssignmentId = '';
            swap.shiftId = '';
          "
        >
          <option value="employee">Đổi với nhân viên khác</option>
          <option value="shift">Xin đổi sang ca khác</option>
        </select>
      </label>
      <label v-if="mode === 'employee'">
        Ca của nhân viên đổi cùng
        <select v-model="swap.targetAssignmentId">
          <option value="">Chọn nhân viên / ca</option>
          <option
            v-for="assignment in scheduled.filter(
              (item) => item.employeeId !== selectedAssignment?.employeeId,
            )"
            :key="assignment.id"
            :value="assignment.id"
          >
            {{ assignmentLabel(assignment.id) }}
          </option>
        </select>
      </label>
      <label v-else>
        Ca muốn đổi sang
        <select v-model="swap.shiftId">
          <option value="">Chọn ca</option>
          <option
            v-for="shift in shifts.filter((item) => item.active)"
            :key="shift.id"
            :value="shift.id"
          >
            {{ shiftName(shift.id) }}
          </option>
        </select>
      </label>
      <label>Lý do *<textarea v-model="swap.reason" /></label>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="primary" :disabled="busy" @click="emit('send')">
        {{ busy ? 'Đang gửi…' : 'Gửi yêu cầu' }}
      </button>
    </div>
  </Dialog>

  <Drawer
    v-model:visible="detailOpen"
    header="Chi tiết yêu cầu đổi ca"
    position="right"
    class="schedule-drawer"
  >
    <template v-if="detail">
      <h3>{{ detail.code }} · {{ labels[detail.status] }}</h3>
      <h4>Trước khi đổi</h4>
      <p>{{ swapBefore(detail) }}</p>
      <p v-if="detail.targetAssignmentId">{{ swapBefore(detail, true) }}</p>
      <h4>Sau khi đổi (dự kiến)</h4>
      <p>{{ swapAfter(detail) }}</p>
      <p v-if="detail.targetAssignmentId">{{ swapAfter(detail, true) }}</p>
      <p>Lý do: {{ detail.reason }}</p>
      <p v-if="detail.decision">Phản hồi: {{ detail.decision }}</p>
      <template v-if="detail.status === 'PENDING' && canApprove">
        <label>Phản hồi / lý do từ chối<textarea v-model="decision" /></label>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="actions">
          <button :disabled="busy" @click="emit('decide', false)">Từ chối</button>
          <button class="primary" :disabled="busy" @click="emit('decide', true)">
            Duyệt đổi ca
          </button>
        </div>
      </template>
    </template>
  </Drawer>
</template>
