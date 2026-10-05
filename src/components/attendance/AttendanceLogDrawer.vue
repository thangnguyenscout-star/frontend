<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppDrawer from '@/components/common/AppDrawer.vue';
import AppButton from '@/components/common/AppButton.vue';
import { recordService } from '@/services/modules/record.service';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import { usePermission } from '@/composables/usePermission';
import type { HrRecord } from '@/types/common';
const props=defineProps<{visible:boolean;record?:HrRecord}>();
const emit=defineEmits<{'update:visible':[boolean];saved:[]}>();
const permission=usePermission(),{t}=useI18n();
const note=ref(''),busy=ref(false),error=ref('');
watch(()=>props.record,r=>{note.value=String(r?.note||'');error.value='';},{immediate:true});
async function save(status:string){if(!props.record||busy.value||!permission.can('attendance','approve'))return;if(!note.value.trim()){error.value='Vui l?ng nh?p n?i dung gi?i tr?nh ho?c ghi ch? ??i so?t.';return;}busy.value=true;error.value='';try{await recordService.save('attendance',{...props.record,status,note:note.value.trim()});emit('saved');emit('update:visible',false);}catch(e){error.value=t(apiErrorKey(e));}finally{busy.value=false;}}
</script>
<template><AppDrawer :visible="visible" header="Chi ti?t Nh?t k? Qu?t th?" position="right" :style="{width:'440px',maxWidth:'100vw'}" @update:visible="emit('update:visible',$event)"><template v-if="record"><div class="summary-card"><strong>{{ record.name }}</strong><p>{{ record.employeeId }} ? {{ record.date }}</p></div><div v-for="key in ['shift','checkIn','checkOut','hours','lateMinutes','status']" :key="key" class="summary-row"><span>{{ t(key) }}</span><strong>{{ record[key] || '?' }}</strong></div><section class="profile-panel" style="margin-top:16px"><h2>H? s? Gi?i tr?nh &amp; ??i so?t</h2><label class="form-field" for="attendance-note">N?i dung gi?i tr?nh<textarea id="attendance-note" v-model="note" rows="5" :readonly="!permission.can('attendance','approve')" :aria-invalid="!!error" /></label><p v-if="error" role="alert" class="field-error">{{ error }}</p><div v-if="permission.can('attendance','approve')" class="dialog-footer"><AppButton label="Y?u c?u gi?i tr?nh l?i" severity="secondary" outlined :disabled="busy" @click="save('pending')"/><AppButton label="X?c nh?n h?p l?" :loading="busy" @click="save('approved')"/></div></section></template></AppDrawer></template>
