import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false);
  return { collapsed };
});
