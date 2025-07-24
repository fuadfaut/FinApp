<template>
  <div v-if="showInstallPrompt" class="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 flex justify-between items-center z-50">
    <div>
      <h3 class="font-bold text-lg">Instal FinApp</h3>
      <p class="text-sm">Instal aplikasi ini untuk akses lebih cepat dan pengalaman offline</p>
    </div>
    <div class="flex space-x-2">
      <button @click="cancelInstall" class="px-3 py-1 bg-indigo-500 rounded-md hover:bg-indigo-400">
        Nanti
      </button>
      <button @click="installApp" class="px-3 py-1 bg-white text-indigo-600 rounded-md hover:bg-gray-100">
        Instal
      </button>
    </div>
  </div>

  <div v-if="offlineReady || needRefresh" class="fixed bottom-0 left-0 right-0 bg-green-600 text-white p-4 flex justify-between items-center z-50">
    <div>
      <h3 class="font-bold text-lg" v-if="offlineReady">Aplikasi siap digunakan offline</h3>
      <h3 class="font-bold text-lg" v-if="needRefresh">Pembaruan tersedia</h3>
      <p class="text-sm" v-if="needRefresh">Klik tombol Perbarui untuk mendapatkan versi terbaru</p>
    </div>
    <div class="flex space-x-2">
      <button v-if="needRefresh" @click="updateServiceWorker()" class="px-3 py-1 bg-white text-green-600 rounded-md hover:bg-gray-100">
        Perbarui
      </button>
      <button @click="close" class="px-3 py-1 bg-green-500 rounded-md hover:bg-green-400">
        Tutup
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNuxtApp } from '#app';

const nuxtApp = useNuxtApp();
const $pwa = computed(() => nuxtApp.$pwa);

// Computed properties for PWA states
const showInstallPrompt = computed(() => $pwa.value?.showInstallPrompt);
const offlineReady = computed(() => $pwa.value?.offlineReady);
const needRefresh = computed(() => $pwa.value?.needRefresh);

// Methods for PWA actions
const installApp = async () => {
  if ($pwa.value) {
    await $pwa.value.install();
  }
};

const cancelInstall = () => {
  if ($pwa.value) {
    $pwa.value.cancelInstall();
  }
};

const updateServiceWorker = async (reloadPage = true) => {
  if ($pwa.value) {
    await $pwa.value.updateServiceWorker(reloadPage);
  }
};

const close = async () => {
  if ($pwa.value) {
    await $pwa.value.cancelPrompt();
  }
};
</script>