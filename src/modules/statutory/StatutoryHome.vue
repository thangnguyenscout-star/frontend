<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePermission } from '@/composables/usePermission';
import StatutoryNavigationCard from './StatutoryNavigationCard.vue';
import {
  statutoryCards,
  availableStatutorySections,
  resolveStatutorySection,
  type StatutorySection,
} from './statutory-navigation';
import './statutory.css';
const route = useRoute(),
  router = useRouter(),
  permission = usePermission();
const { t } = useI18n();
const sections = computed(() => availableStatutorySections(permission.can));
const section = computed(() => resolveStatutorySection(route.query.section, permission.can));
const permittedCards = computed(() => statutoryCards(permission.can));
const cards = computed(() => permittedCards.value.filter((item) => item.section === section.value));
const count = (value: StatutorySection) =>
  permittedCards.value.filter((item) => item.section === value).length;
watch(
  sections,
  (value) => {
    if (!value.length) {
      void router.replace('/forbidden');
      return;
    }
    if (section.value && route.query.section !== section.value)
      void router.replace({
        name: 'statutory-home',
        query: { ...route.query, section: section.value },
      });
  },
  { immediate: true },
);
async function choose(value: StatutorySection) {
  if (value !== section.value && sections.value.includes(value))
    await router.push({ name: 'statutory-home', query: { ...route.query, section: value } });
}
async function tabKey(event: KeyboardEvent, index: number) {
  const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
  if (!direction && event.key !== 'Home' && event.key !== 'End') return;
  event.preventDefault();
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? sections.value.length - 1
        : (index + direction + sections.value.length) % sections.value.length;
  const value = sections.value[next];
  if (!value) return;
  await choose(value);
  await nextTick();
  document.getElementById(`statutory-tab-${value}`)?.focus();
}
</script>
<template>
  <section v-if="section" class="statutory-home">
    <nav class="statutory-breadcrumb" :aria-label="t('statutory.breadcrumb')">
      <RouterLink to="/dashboard">{{ t('dashboard') }}</RouterLink
      ><i class="pi pi-angle-right" aria-hidden="true" /><span>{{ t('statutory.title') }}</span
      ><i class="pi pi-angle-right" aria-hidden="true" /><span aria-current="page">{{
        t(`statutory.sections.${section}.title`)
      }}</span>
    </nav>
    <header class="statutory-heading">
      <div>
        <span class="statutory-eyebrow"
          ><i class="pi pi-shield" aria-hidden="true" />{{ t('statutory.eyebrow') }}</span
        >
        <h1>{{ t('statutory.title') }}</h1>
        <p>{{ t('statutory.description') }}</p>
      </div>
      <span class="statutory-scope"
        ><i class="pi pi-building" aria-hidden="true" />{{ t('statutory.workspace') }}</span
      >
    </header>
    <div class="statutory-tabs" role="tablist" :aria-label="t('statutory.tabsLabel')">
      <button
        v-for="(item, index) in sections"
        :id="`statutory-tab-${item}`"
        :key="item"
        type="button"
        role="tab"
        :aria-selected="section === item"
        :aria-controls="`statutory-panel-${item}`"
        :tabindex="section === item ? 0 : -1"
        :class="{ active: section === item }"
        @click="choose(item)"
        @keydown="tabKey($event, index)"
      >
        <span class="statutory-tab-icon"
          ><i
            :class="['pi', item === 'insurance' ? 'pi-shield' : 'pi-calculator']"
            aria-hidden="true" /></span
        ><span
          ><strong>{{ t(`statutory.sections.${item}.title`) }}</strong
          ><small>{{ t(`statutory.sections.${item}.subtitle`) }}</small></span
        ><span class="statutory-tab-count">{{ count(item) }}</span>
      </button>
    </div>
    <section
      :id="`statutory-panel-${section}`"
      class="statutory-panel"
      role="tabpanel"
      :aria-labelledby="`statutory-tab-${section}`"
      tabindex="0"
    >
      <div class="statutory-section-heading">
        <div>
          <h2>{{ t(`statutory.sections.${section}.title`) }}</h2>
          <p>{{ t(`statutory.sections.${section}.description`) }}</p>
        </div>
        <span>{{ t('statutory.functionCount', { count: cards.length }) }}</span>
      </div>
      <div class="statutory-card-grid">
        <StatutoryNavigationCard v-for="item in cards" :key="item.key" :item="item" />
      </div>
    </section>
    <aside class="statutory-note">
      <i class="pi pi-info-circle" aria-hidden="true" />
      <div>
        <strong>{{ t('statutory.phaseTitle') }}</strong>
        <p>{{ t('statutory.phaseDescription') }}</p>
      </div>
    </aside>
  </section>
</template>
