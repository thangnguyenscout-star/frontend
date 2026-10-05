<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import PrimeControl, { type DatePickerProps } from 'primevue/datepicker';
import { maskDateInput, parseMaskedDate } from '@/utils/dateInput';

defineOptions({ inheritAttrs: false });
const props = defineProps<{ modelValue?: DatePickerProps['modelValue']; mask?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [DatePickerProps['modelValue']]; 'invalid-change': [boolean] }>();
const attrs = useAttrs();
const invalidInput = ref(false);
watch(invalidInput, value => emit('invalid-change', value), { flush: 'sync' });
let draft: string | undefined;
let inputElement: HTMLInputElement | undefined;
let typing = false;
let accepted = false;
const attribute = (name: string, camel: string) => attrs[name] ?? attrs[camel];
const masked = computed(() => props.mask !== false
  && (attribute('date-format', 'dateFormat') ?? 'dd/mm/yy') === 'dd/mm/yy'
  && (attribute('selection-mode', 'selectionMode') ?? 'single') === 'single'
  && !attribute('show-time', 'showTime') && !attribute('time-only', 'timeOnly')
  && (attrs.view ?? 'date') === 'date');

function restoreDraft() {
  if (draft !== undefined && inputElement) inputElement.value = draft;
}
function update(value: DatePickerProps['modelValue']) {
  accepted = true;
  if (!typing) { draft = undefined; invalidInput.value = false; }
  emit('update:modelValue', value);
}
function captureInput(event: Event) {
  if (!masked.value || !(event.target instanceof HTMLInputElement)) return;
  const input = event.target;
  if (input.disabled || input.readOnly) return;
  inputElement = input;
  const result = maskDateInput(input.value, input.selectionStart ?? input.value.length);
  input.value = result.text;
  input.setSelectionRange(result.caret, result.caret);
  draft = result.text;
  const valid = !draft || !!parseMaskedDate(draft);
  invalidInput.value = !valid;
  typing = true;
  accepted = false;
  if (!valid) {
    // Do not let PrimeVue interpret an incomplete year or keep the previous date.
    event.stopImmediatePropagation();
    emit('update:modelValue', null);
  }
  void nextTick(() => {
    // PrimeVue also rejects dates outside min/max or disabled-date constraints.
    if (valid && !accepted) {
      invalidInput.value = !!draft;
      emit('update:modelValue', null);
    }
    void nextTick(() => {
      typing = false;
      restoreDraft();
      if (document.activeElement === input) input.setSelectionRange(result.caret, result.caret);
    });
  });
}
function blur() {
  if (masked.value && draft !== undefined) void nextTick(restoreDraft);
}
watch(() => props.modelValue, () => {
  if (!typing) { draft = undefined; invalidInput.value = false; }
});
</script>
<template>
  <span
    class="app-date-picker"
    @input.capture="captureInput"
    @focusout="blur"
  >
    <PrimeControl
      date-format="dd/mm/yy"
      placeholder="dd/mm/yyyy"
      show-icon
      :manual-input="true"
      :show-on-focus="false"
      :pt="{ pcInputText: { inputmode: masked ? 'numeric' : undefined } }"
      v-bind="$attrs"
      :model-value="modelValue"
      :invalid="invalidInput || !!$attrs.invalid"
      @update:model-value="update"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </PrimeControl>
    <small
      v-if="invalidInput"
      class="field-error"
      role="alert"
    >
      Ngày không hợp lệ. Nhập theo định dạng dd/mm/yyyy.
    </small>
  </span>
</template>
<style scoped>
.app-date-picker { display: inline-flex; flex-direction: column; gap: 4px; }
.app-date-picker :deep(.p-datepicker) { width: 100%; }
.field-error { color: #b42318; font-size: 12px; }
</style>
