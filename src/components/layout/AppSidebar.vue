<script setup lang="ts">
import { computed, ref } from 'vue';
import { statutorySidebarItems } from '@/modules/statutory/statutory-navigation';
import { useRoute } from 'vue-router';
import { attendanceNavigation } from '@/constants/attendance';
const route = useRoute();
const attendanceOpen = ref(true);
const leaveOpen = ref(true);
import { useAuth } from '@/composables/useAuth';
const auth = useAuth();
import { useI18n } from 'vue-i18n';
import { modules } from '@/constants/modules';
import { usePermission } from '@/composables/usePermission';
import { useAppStore } from '@/stores/app.store';
const { t } = useI18n();
const permission = usePermission(),
  app = useAppStore();
const visibleItems = computed(() => statutorySidebarItems(modules, permission.can));
const hidden = ref<string[]>([]);
function toggle(group: string) {
  hidden.value = hidden.value.includes(group)
    ? hidden.value.filter((g) => g !== group)
    : [...hidden.value, group];
}
</script>
<template>
  <aside class="sidebar" :class="{ collapsed: app.collapsed }">
    <RouterLink class="brand" to="/dashboard">
      <span class="brand-mark"
        ><img
          src="/stitch-logo.png"
          alt="Grand Hotel"
          style="width: 32px; height: 32px; object-fit: contain" /></span
      ><span class="brand-name"
        >Grand Hotel HR<small>{{ t('brand') }}</small></span
      >
    </RouterLink>
    <div class="hotel-switch">
      <i class="pi pi-building-columns" />
      <div>
        Grand Hotel Saigon<small>{{ t('workspace') }}</small>
      </div>
      <i class="pi pi-angle-down" />
    </div>
    <nav>
      <RouterLink class="nav-link" to="/dashboard">
        <i class="pi pi-th-large" /><span>{{ t('dashboard') }}</span> </RouterLink
      ><template v-for="group in ['people', 'operations', 'finance']" :key="group">
        <template v-if="visibleItems.some((m) => m.group === group)">
          <button class="nav-group" @click="toggle(group)">
            <span>{{ t(group) }}</span
            ><i
              :class="['pi', hidden.includes(group) ? 'pi-angle-right' : 'pi-angle-down']"
            /></button
          ><template v-if="!hidden.includes(group)">
            <template v-for="item in visibleItems.filter((m) => m.group === group)" :key="item.key">
              <div v-if="item.key === 'attendance'" class="attendance-menu">
                <button
                  class="nav-link attendance-toggle"
                  :class="{ 'module-active': route.path.startsWith('/attendance') }"
                  :aria-expanded="attendanceOpen"
                  title="Chấm công"
                  @click="attendanceOpen = !attendanceOpen"
                >
                  <i class="pi pi-clock" /><span>{{ t('modules.attendance') }}</span
                  ><i :class="['pi', attendanceOpen ? 'pi-angle-up' : 'pi-angle-down']" />
                </button>
                <div v-if="attendanceOpen" class="attendance-submenu">
                  <RouterLink
                    v-for="page in attendanceNavigation"
                    :key="page.path"
                    :to="page.path"
                    class="nav-link"
                    :title="page.label"
                    ><i :class="['pi', page.icon]" /><span>{{ page.label }}</span></RouterLink
                  >
                </div>
              </div>
              <div v-else-if="item.key === 'leave'" class="attendance-menu">
                <button
                  class="nav-link attendance-toggle"
                  :class="{ 'module-active': route.path.startsWith('/leave') }"
                  :aria-expanded="leaveOpen"
                  title="Nghỉ phép"
                  @click="leaveOpen = !leaveOpen"
                >
                  <i class="pi pi-calendar-minus" /><span>{{ t('modules.leave') }}</span>
                  <i :class="['pi', leaveOpen ? 'pi-angle-up' : 'pi-angle-down']" />
                </button>
                <div v-if="leaveOpen" class="attendance-submenu">
                  <RouterLink to="/leave" class="nav-link" exact-active-class="module-active"
                    ><i class="pi pi-file-edit" /><span>Đơn nghỉ phép</span></RouterLink
                  >
                  <RouterLink to="/leave/annual" class="nav-link"
                    ><i class="pi pi-wallet" /><span>Quản lý phép năm</span></RouterLink
                  >
                </div>
              </div>
              <RouterLink
                v-else
                :to="'/' + item.key"
                class="nav-link"
                :class="{
                  'statutory-active':
                    item.key === 'statutory' && route.path.startsWith('/statutory'),
                }"
                :title="t('modules.' + item.key)"
                ><i :class="['pi', item.icon]" /><span>{{
                  t('modules.' + item.key)
                }}</span></RouterLink
              >
            </template>
          </template>
        </template>
      </template>
    </nav>
    <div class="sidebar-footer">
      <div class="user-avatar">HR</div>
      <div>
        <strong>{{ auth.role }}</strong
        ><small>Grand Hotel Saigon</small>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nav-link.statutory-active {
  background: #0067c00f;
  color: var(--accent);
}
.nav-link.statutory-active span {
  white-space: normal;
  line-height: 1.5;
}

.attendance-toggle {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
}
.attendance-toggle > i:last-child {
  margin-left: auto;
  min-width: auto;
  font-size: 11px;
}
.attendance-toggle.module-active {
  color: var(--accent);
  font-weight: 500;
}
.attendance-submenu {
  margin: 4px 0 8px 21px;
  padding-left: 6px;
  border-left: 1px solid var(--line);
}
.attendance-submenu .nav-link {
  white-space: normal;
}
.collapsed .attendance-submenu {
  margin-left: 0;
  padding-left: 0;
  border: 0;
}
@media (max-width: 1100px) {
  .attendance-submenu {
    margin-left: 0;
    padding-left: 0;
    border: 0;
  }
}
</style>
