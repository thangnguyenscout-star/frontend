<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import AppToast from '@/components/common/AppToast.vue';
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useAuth } from '@/composables/useAuth';
import { startSession } from '@/services/auth/session.service';
import { router } from '@/router';
const { t } = useI18n();
const auth = useAuth();
const warning = ref(false);
let session: ReturnType<typeof startSession> | undefined;
function expire() {
  auth.logout();
  warning.value = false;
  router.replace('/login?expired=1');
}
function logout() {
  auth.logout();
  warning.value = false;
  router.replace('/login');
}
watch(
  () => auth.authenticated,
  (active) => {
    session?.stop();
    if (active)
      session = startSession(
        () => (warning.value = true),
        expire,
        () => (warning.value = false),
      );
    else warning.value = false;
  },
  { immediate: true },
);
window.addEventListener('hr-session-expired', expire);
onUnmounted(() => {
  session?.stop();
  window.removeEventListener('hr-session-expired', expire);
});
</script>
<template>
  <RouterView /><AppToast /><AppConfirmDialog /><Dialog
    v-model:visible="warning"
    modal
    :closable="false"
    :header="t('sessionWarning')"
  >
    <div class="toolbar-actions">
      <AppButton
        :label="t('continue')"
        @click="session?.touch()"
      /><AppButton
        :label="t('logout')"
        severity="secondary"
        @click="logout"
      />
    </div>
  </Dialog>
</template>
