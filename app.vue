<template>
  <div>
    <NuxtPwaManifest />
    <NuxtPage />
  </div>
</template>

<style>
@import '~/assets/css/main.css';
</style>

<script setup>
import { useFinanceStore } from '~/stores/financeStore';

const store = useFinanceStore();

// Initialize store on app load
onMounted(() => {
  store.initializeStore();
});
</script>