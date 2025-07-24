<template>
  <div>
    <PWAInstallPrompt />
    <div class="flex justify-around items-center bg-white border-t border-gray-200 p-4 rounded-b-2xl fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40" style="box-shadow: 0 -2px 12px rgba(0,0,0,0.04);">
      <NuxtLink to="/" class="flex flex-col items-center" :class="currentRoute === '/' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
        <span class="text-xs mt-1">Beranda</span>
      </NuxtLink>
      <NuxtLink to="/laporan" class="flex flex-col items-center" :class="currentRoute === '/laporan' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10v6a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 9a2 2 0 00-2 2v4a2 2 0 002 2h2.5a2 2 0 002-2V15a2 2 0 00-2-2H6z" clip-rule="evenodd"></path></svg>
        <span class="text-xs mt-1">Laporan</span>
      </NuxtLink>
      <NuxtLink to="/ekspor-impor" class="flex flex-col items-center" :class="currentRoute === '/ekspor-impor' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
        <span class="text-xs mt-1">Ekspor/Impor</span>
      </NuxtLink>
      <NuxtLink to="/profil" class="flex flex-col items-center" :class="currentRoute === '/profil' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        <span class="text-xs mt-1">Profil</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PWAInstallPrompt from './PWAInstallPrompt.vue';

const route = useRoute();

// Current route
const currentRoute = computed(() => route.path);
</script>