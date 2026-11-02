<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { StatutoryNavItem } from './statutory-navigation';
const props = defineProps<{ item: StatutoryNavItem }>();
const { t, tm, rt } = useI18n();
const prefix = computed(() => `statutory.cards.${props.item.messageKey}`);
const topics = computed(() => tm(`${prefix.value}.topics`) as string[]);
</script>
<template>
  <article
    class="statutory-card"
    :aria-labelledby="`statutory-card-${item.key}`"
    :data-feature="item.key"
  >
    <div class="statutory-card-top">
      <span class="statutory-card-icon"><i :class="['pi', item.icon]" aria-hidden="true" /></span
      ><span v-if="!item.enabled" class="statutory-coming"
        ><i class="pi pi-clock" aria-hidden="true" />{{ t('statutory.comingSoon') }}</span
      >
    </div>
    <h3 :id="`statutory-card-${item.key}`">{{ t(`${prefix}.title`) }}</h3>
    <p>{{ t(`${prefix}.description`) }}</p>
    <ul>
      <li v-for="(topic, index) in topics" :key="index">
        <i class="pi pi-check" aria-hidden="true" />{{ rt(topic) }}
      </li>
    </ul>
    <RouterLink v-if="item.enabled" class="statutory-card-action" :to="{ name: item.routeName }"
      >{{ t('statutory.open') }}<i class="pi pi-arrow-up-right" aria-hidden="true"
    /></RouterLink>
    <button v-else class="statutory-card-action" type="button" disabled>
      {{ t('statutory.preparing') }}<i class="pi pi-lock" aria-hidden="true" />
    </button>
  </article>
</template>
