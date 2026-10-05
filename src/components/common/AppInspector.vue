<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AppDrawer from './AppDrawer.vue';
defineProps<{ visible: boolean; header: string }>();
const emit = defineEmits<{ 'update:visible': [boolean] }>();
const docked = ref(false);
let media: MediaQueryList | undefined;
function update(){docked.value=!!media?.matches;}
onMounted(()=>{media=window.matchMedia('(min-width: 1920px)');update();media.addEventListener('change',update);});
onUnmounted(()=>media?.removeEventListener('change',update));
</script>
<template>
 <aside v-if="docked && visible" class="stitch-inspector" :aria-label="header"><header><h2>{{ header }}</h2><button class="icon-button" aria-label="??ng chi ti?t" @click="emit('update:visible',false)"><i class="pi pi-times" /></button></header><slot /></aside>
 <AppDrawer v-else-if="!docked" :visible="visible" position="right" :header="header" :style="{width:'420px',maxWidth:'100vw'}" @update:visible="emit('update:visible',$event)"><slot /></AppDrawer>
</template>
<style scoped>
.stitch-inspector{position:fixed;right:24px;top:88px;bottom:24px;width:380px;padding:16px;background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow-y:auto;box-shadow:0 4px 8px #0000000a;z-index:20}
header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e5e5;padding-bottom:12px;margin-bottom:16px}h2{font-size:14px;margin:0}
</style>
