<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Select from 'primevue/select';
import { useAuth } from '@/composables/useAuth';
import { useConfirm } from '@/composables/useConfirm';
import { useAppStore } from '@/stores/app.store';
const { t, locale } = useI18n();
const auth = useAuth(),
  app = useAppStore(),
  confirm = useConfirm(),
  router = useRouter();
const notifications = ref(false);
const search = ref('');
function findEmployee() {
  if (search.value.trim())
    router.push({ path: '/employees', query: { search: search.value.trim() } });
}
watch(locale, (v) => {
  localStorage.setItem('hr-locale', v);
  document.documentElement.lang = v;
});
function logout() {
  confirm(() => {
    auth.logout();
    router.push('/login');
  });
}
</script>
<template>
  <header class="app-header">
    <div class="header-left">
      <button
        class="icon-button"
        :aria-label="t('more')"
        @click="app.collapsed = !app.collapsed"
      >
        <i class="pi pi-bars" />
      </button><span>Quản trị HR <i class="pi pi-angle-right" /> Grand Hotel</span>
      <form
        class="header-search"
        @submit.prevent="findEmployee"
      >
        <i class="pi pi-search" /><input
          v-model="search"
          aria-label="Tìm kiếm nhân viên"
          placeholder="Tìm kiếm nhân viên, mã NV, phòng ban…"
        >
      </form>
    </div>
    <div class="header-right">
      <span class="header-date"><i class="pi pi-calendar" /> {{ new Date().toLocaleDateString('vi-VN') }}</span>
      <Select
        v-model="locale"
        :options="[
          { label: 'Tiếng Việt', value: 'vi' },
          { label: 'English', value: 'en' },
          { label: 'Français', value: 'fr' },
        ]"
        option-label="label"
        option-value="value"
        aria-label="Language"
        class="language-select"
      />
      <div class="notification-wrap">
        <button
          class="icon-button"
          :aria-label="t('notifications')"
          @click="notifications = !notifications"
        >
          <i class="pi pi-bell" />
        </button>
        <div
          v-if="notifications"
          class="notification-panel"
        >
          <strong>{{ t('notifications') }}</strong>
          <p>{{ t('noNotifications') }}</p>
        </div>
      </div>
      <span class="header-divider" />
      <div class="user-avatar">
        HR
      </div>
      <div class="user-info">
        <strong>{{ auth.role }}</strong><small>Grand Hotel Saigon</small>
      </div>
      <button
        class="icon-button"
        :aria-label="t('logout')"
        :title="t('logout')"
        @click="logout"
      >
        <i class="pi pi-sign-out" />
      </button>
    </div>
  </header>
</template>
