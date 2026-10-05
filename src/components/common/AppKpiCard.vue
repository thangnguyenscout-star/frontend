<script setup lang="ts">
defineProps<{ label: string; value: string | number; note?: string; icon?: string; tone?: 'blue' | 'green' | 'amber' | 'red' }>();
</script>
<template>
  <article class="stitch-kpi" :class="tone || 'blue'">
    <div class="kpi-label"><span>{{ label }}</span><i v-if="icon" :class="['pi', icon]" aria-hidden="true" /></div>
    <strong>{{ value }}</strong><small v-if="note">{{ note }}</small><slot />
  </article>
</template>
<style scoped>
.stitch-kpi{min-width:0;padding:16px;background:white;border:1px solid #e5e5e5;border-radius:8px;border-top:3px solid #0067c0;box-shadow:0 1px 2px #00000006}
.kpi-label{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#414752;font-size:11px;font-weight:600}
.kpi-label i{color:#0067c0;font-size:18px}.stitch-kpi strong{display:block;font-size:28px;line-height:36px;margin:12px 0 8px;font-weight:600;overflow-wrap:anywhere}
.stitch-kpi small{font-size:11px;color:#717783}.green{border-top-color:#107c10}.amber{border-top-color:#f7630c}.red{border-top-color:#ba1a1a}
</style>
