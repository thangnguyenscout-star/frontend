<script setup lang="ts">
import type { Shift, ScheduleTemplate } from '@/types/schedule';

defineProps<{
  templates: ScheduleTemplate[];
  shifts: Shift[];
  departments: string[];
  busy: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canBulk: boolean;
}>();
const emit = defineEmits<{
  create: [];
  open: [template: ScheduleTemplate | undefined, copy: boolean, read: boolean];
  toggle: [template: ScheduleTemplate];
  apply: [template: ScheduleTemplate];
}>();
</script>

<template>
  <section class="panel form">
    <div class="toolbar">
      <div>
        <h2>Mẫu lịch tái sử dụng</h2>
        <p>Mẫu chỉ trở thành lịch thực tế khi được áp dụng.</p>
      </div>
      <button v-if="canCreate" class="primary" @click="emit('create')">+ Tạo mẫu</button>
    </div>
    <p v-if="!templates.length" class="empty-state">
      Chưa có mẫu lịch. Tạo mẫu để tái sử dụng khi phân công.
    </p>
    <article v-for="template in templates" :key="template.id" class="template-card">
      <div class="toolbar">
        <h3>{{ template.name }}</h3>
        <span>{{ template.active ? 'Hoạt động' : 'Ngừng sử dụng' }}</span>
      </div>
      <p>
        {{ template.scheduleType === 'ADMINISTRATIVE' ? 'Hành chính' : 'Xoay ca' }} ·
        {{ template.department || 'Tất cả bộ phận' }} ·
        {{ template.kind === 'WEEK' ? 'Tuần' : 'Chu kỳ ' + template.days.length + ' ngày' }}
      </p>
      <div class="pattern">
        <span v-for="(id, index) in template.days" :key="index">
          <small>{{
            template.kind === 'WEEK' ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index] : index + 1
          }}</small>
          {{ id === 'OFF' ? 'Nghỉ' : shifts.find((shift) => shift.id === id)?.name }}
        </span>
      </div>
      <div class="actions">
        <button @click="emit('open', template, false, true)">Xem</button>
        <button v-if="canEdit" @click="emit('open', template, false, false)">Sửa</button>
        <button v-if="canCreate" @click="emit('open', template, true, false)">Nhân bản</button>
        <button v-if="canEdit" :disabled="busy" @click="emit('toggle', template)">
          {{ template.active ? 'Ngừng sử dụng' : 'Kích hoạt' }}
        </button>
        <button v-if="template.active && canBulk" @click="emit('apply', template)">
          Áp dụng mẫu
        </button>
      </div>
    </article>
  </section>
</template>
