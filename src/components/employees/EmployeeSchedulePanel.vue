<script setup lang="ts">
import { computed, ref } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import AppEmptyState from '@/components/common/AppEmptyState.vue';
import ShiftLegend from '@/components/schedules/ShiftLegend.vue';
import { shifts, shiftCode, weekDays } from '@/utils/shifts';
import type { HrRecord } from '@/types/common';
const props=defineProps<{records:HrRecord[]}>();
const offset=ref(0),days=computed(()=>weekDays(offset.value));
const records=computed(()=>props.records.filter(r=>days.value.some(d=>d.date===r.date)).sort((a,b)=>String(a.date).localeCompare(String(b.date))));
const hours=computed(()=>records.value.reduce((s,r)=>s+Number(r.hours||0),0));
</script>
<template><div class="schedule-toolbar"><div class="week-switcher"><AppButton icon="pi pi-angle-left" aria-label="Tu?n tr??c" text severity="secondary" @click="offset--"/><strong>{{ days[0].day }} ? {{ days[6].day }}</strong><AppButton icon="pi pi-angle-right" aria-label="Tu?n sau" text severity="secondary" @click="offset++"/><AppButton label="H?m nay" text @click="offset=0"/></div><RouterLink to="/schedules">??i ca / M? b?ng ph?n ca ?</RouterLink></div><ShiftLegend/><section class="panel"><AppEmptyState v-if="!records.length" title="Ch?a c? l?ch l?m vi?c trong tu?n" @reset="offset=0"/><article v-for="r in records" :key="r.id" class="schedule-day"><strong>{{ days.find(d=>d.date===r.date)?.label }}<br/>{{ days.find(d=>d.date===r.date)?.day }}</strong><span :class="['shift-code',shiftCode(r.shift)]">{{ shiftCode(r.shift) }}</span><div><strong>{{ shifts.find(s=>s.code===shiftCode(r.shift))?.name }} ? {{ r.shift }}</strong><p><i class="pi pi-map-marker"/> {{ r.department }} ? {{ r.note || 'L?ch ph?n ca b? ph?n' }}</p></div><div><strong>{{ r.hours }}h</strong><p>{{ r.status==='approved'?'?? duy?t':r.status==='pending'?'Ch? duy?t':'D? ki?n' }}</p></div></article></section><section class="profile-panel"><h2>T?m t?t Gi? c?ng Tu?n</h2><div class="compensation-cards"><div><span>T?ng gi? c?ng</span><strong>{{ hours.toFixed(1) }}h</strong></div><div><span>Gi? v??t ??nh m?c 40h</span><strong>{{ Math.max(0,hours-40).toFixed(1) }}h</strong></div></div><div class="summary-row"><span>Ng?y ngh? tu?n</span><strong>{{ records.filter(r=>r.shift==='OFF').length }} ng?y</strong></div></section></template>
<style scoped>@media(max-width:600px){.schedule-day{flex-wrap:wrap;gap:12px}.schedule-day>div:nth-child(3){min-width:150px}.week-switcher{gap:2px}}</style>
