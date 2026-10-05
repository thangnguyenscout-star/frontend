import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
export default defineConfigWithVueTs(
  { ignores: ['dist/**'] },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  { rules: { 'vue/multi-word-component-names': 'off' } },
);
