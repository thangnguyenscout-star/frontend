<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import AppButton from '@/components/common/AppButton.vue';
import type { ContractOption } from '@/types/contract';

const props = defineProps<{
  visible: boolean;
  options: ContractOption[];
  selectedValue?: string;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  'update:visible': [boolean];
  select: [ContractOption];
}>();

const keyword = ref('');
const pendingValue = ref('');

const rows = computed(() => {
  const search = keyword.value.trim().toLocaleLowerCase('vi');
  return props.options.filter((option) =>
    [option.value, option.label].some((value) => value.toLocaleLowerCase('vi').includes(search)),
  );
});

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return;
    keyword.value = '';
    pendingValue.value = props.selectedValue || '';
  },
);

function employeeName(option: ContractOption) {
  const prefix = option.value + ' - ';
  return option.label.startsWith(prefix) ? option.label.slice(prefix.length) : option.label;
}
function close() {
  emit('update:visible', false);
}
function choose(option?: ContractOption) {
  const selected = option || props.options.find((item) => item.value === pendingValue.value);
  if (!selected || props.disabled) return;
  emit('select', selected);
  close();
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Chọn nhân viên"
    :style="{ width: '720px', maxWidth: 'calc(100vw - 32px)' }"
    :draggable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="employee-picker">
      <span class="search-box">
        <i class="pi pi-search" />
        <InputText
          v-model="keyword"
          autofocus
          placeholder="Tìm theo mã hoặc tên nhân viên"
          aria-label="Tìm nhân viên"
        />
      </span>

      <div
        class="employee-list"
        role="listbox"
        aria-label="Danh sách nhân viên"
      >
        <button
          v-for="option in rows"
          :key="option.value"
          type="button"
          :class="['employee-option', { selected: pendingValue === option.value }]"
          role="option"
          :aria-selected="pendingValue === option.value"
          @click="pendingValue = option.value"
          @dblclick="choose(option)"
        >
          <span class="employee-avatar"><i class="pi pi-user" /></span>
          <span class="employee-info">
            <strong>{{ employeeName(option) }}</strong>
            <small>{{ option.value }}</small>
          </span>
          <i
            v-if="pendingValue === option.value"
            class="pi pi-check selected-icon"
          />
        </button>
        <p
          v-if="!rows.length"
          class="empty-result"
        >
          Không tìm thấy nhân viên phù hợp.
        </p>
      </div>
    </div>

    <template #footer>
      <AppButton
        label="Hủy"
        severity="secondary"
        outlined
        type="button"
        @click="close"
      />
      <AppButton
        label="Chọn"
        icon="pi pi-check"
        type="button"
        :disabled="!pendingValue || disabled"
        @click="choose()"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.employee-picker {
  display: grid;
  gap: 16px;
}
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}
.search-box > i {
  position: absolute;
  left: 13px;
  z-index: 1;
  color: #64748b;
}
.search-box :deep(input) {
  width: 100%;
  padding-left: 38px;
}
.employee-list {
  display: grid;
  gap: 8px;
  max-height: 420px;
  padding: 4px;
  overflow: auto;
}
.employee-option {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 24px;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 11px 14px;
  color: #1e293b;
  text-align: left;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
}
.employee-option:hover {
  border-color: #93c5fd;
  background: #f8fbff;
}
.employee-option.selected {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 0 0 1px #2563eb;
}
.employee-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #2563eb;
  background: #dbeafe;
  border-radius: 50%;
}
.employee-info {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.employee-info strong,
.employee-info small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.employee-info small {
  color: #64748b;
}
.selected-icon {
  color: #2563eb;
}
.empty-result {
  padding: 40px 16px;
  margin: 0;
  color: #64748b;
  text-align: center;
}
</style>
