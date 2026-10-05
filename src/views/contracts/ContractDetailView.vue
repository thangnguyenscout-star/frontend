<script setup lang="ts">
// Compatibility entry: legacy links open the same read-only list drawer.
import { useRoute } from 'vue-router';
import ContractListView from './ContractListView.vue';
const route = useRoute();
</script>
<template><ContractListView :initial-contract-id="String(route.params.id)" /></template>
