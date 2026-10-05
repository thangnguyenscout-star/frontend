<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
const auth = useAuth();
import { useI18n } from 'vue-i18n';
import { modules } from '@/constants/modules';
import { usePermission } from '@/composables/usePermission';
import { useAppStore } from '@/stores/app.store';
const { t } = useI18n();
const permission = usePermission(),
  app = useAppStore();
const hidden = ref<string[]>([]);
function toggle(group: string) {
  hidden.value = hidden.value.includes(group)
    ? hidden.value.filter((g) => g !== group)
    : [...hidden.value, group];
}
</script>
<template>
  <aside
    class="sidebar"
    :class="{ collapsed: app.collapsed }"
  >
    <RouterLink
      class="brand"
      to="/dashboard"
    >
      <span class="brand-mark"><img
        src="/stitch-logo.png"
        alt="Grand Hotel"
        style="width: 32px; height: 32px; object-fit: contain"
      ></span><span class="brand-name">Grand Hotel HR<small>{{ t('brand') }}</small></span>
    </RouterLink>
    <div class="hotel-switch">
      <i class="pi pi-building-columns" />
      <div>
        Grand Hotel Saigon<small>{{ t('workspace') }}</small>
      </div>
      <i class="pi pi-angle-down" />
    </div>
    <nav>
      <RouterLink
        class="nav-link"
        to="/dashboard"
      >
        <i class="pi pi-th-large" /><span>{{ t('dashboard') }}</span>
      </RouterLink><template
        v-for="group in ['people', 'operations', 'finance']"
        :key="group"
      >
        <template v-if="modules.some((m) => m.group === group && permission.can(m.key))">
          <button
            class="nav-group"
            @click="toggle(group)"
          >
            <span>{{ t(group) }}</span><i
              :class="['pi', hidden.includes(group) ? 'pi-angle-right' : 'pi-angle-down']"
            />
          </button><template v-if="!hidden.includes(group)">
            <RouterLink
              v-for="item in modules.filter((m) => m.group === group && permission.can(m.key))"
              :key="item.key"
              :to="'/' + item.key"
              class="nav-link"
              :title="t('modules.' + item.key)"
            >
              <i :class="['pi', item.icon]" /><span>{{ t('modules.' + item.key) }}</span>
            </RouterLink>
          </template>
        </template>
      </template>
    </nav>
    <div class="sidebar-footer">
      <div class="user-avatar">
        HR
      </div>
      <div>
        <strong>{{ auth.role }}</strong><small>Grand Hotel Saigon</small>
      </div>
    </div>
  </aside>
</template>
