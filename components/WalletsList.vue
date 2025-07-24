<template>
  <div class="p-6 border-b border-gray-200">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-700">Kantong Saya</h2>
      <button @click="showAddWalletModal = true" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
        + Tambah Kantong
      </button>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Kantong Items -->
      <div 
        v-for="wallet in wallets" 
        :key="wallet.id"
        @click="editWallet(wallet)"
        class="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring bg-white cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <div :class="`bg-${wallet.color || 'blue'}-100 p-2 rounded-full`">
            <!-- Wallet Icon based on type -->
            <svg v-if="wallet.icon === 'bank'" class="w-6 h-6" :class="`text-${wallet.color || 'blue'}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
            </svg>
            <svg v-else-if="wallet.icon === 'wallet'" class="w-6 h-6" :class="`text-${wallet.color || 'purple'}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10v11h18V10M3 10l9-7 9 7M3 10h18"></path>
            </svg>
            <svg v-else class="w-6 h-6" :class="`text-${wallet.color || 'orange'}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 3v2m0 3.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-800">{{ wallet.nama }}</p>
            <p class="text-sm text-gray-500">{{ formatCurrency(wallet.saldo) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Add/Edit Wallet -->
    <div v-if="showAddWalletModal || showEditWalletModal" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">
          {{ showEditWalletModal ? 'Edit Kantong' : 'Tambah Kantong Baru' }}
        </h3>
        
        <form @submit.prevent="saveWallet" class="flex flex-col gap-4">
          <div>
            <label for="walletName" class="block text-sm font-medium text-gray-700 mb-1">Nama Kantong</label>
            <input 
              type="text" 
              id="walletName" 
              v-model="currentWallet.nama" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div>
            <label for="walletBalance" class="block text-sm font-medium text-gray-700 mb-1">Saldo Awal</label>
            <input 
              type="number" 
              id="walletBalance" 
              v-model.number="currentWallet.saldo" 
              required
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ikon</label>
            <div class="flex gap-3">
              <button 
                type="button" 
                @click="currentWallet.icon = 'bank'" 
                :class="`p-2 rounded-full ${currentWallet.icon === 'bank' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100'}`"
              >
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                </svg>
              </button>
              <button 
                type="button" 
                @click="currentWallet.icon = 'wallet'" 
                :class="`p-2 rounded-full ${currentWallet.icon === 'wallet' ? 'bg-purple-100 ring-2 ring-purple-500' : 'bg-gray-100'}`"
              >
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10v11h18V10M3 10l9-7 9 7M3 10h18"></path>
                </svg>
              </button>
              <button 
                type="button" 
                @click="currentWallet.icon = 'digital'" 
                :class="`p-2 rounded-full ${currentWallet.icon === 'digital' ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-100'}`"
              >
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 3v2m0 3.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Warna</label>
            <div class="flex gap-3">
              <button 
                type="button" 
                @click="currentWallet.color = 'blue'" 
                class="w-8 h-8 rounded-full bg-blue-500 border-2"
                :class="currentWallet.color === 'blue' ? 'border-blue-800' : 'border-transparent'"
              ></button>
              <button 
                type="button" 
                @click="currentWallet.color = 'purple'" 
                class="w-8 h-8 rounded-full bg-purple-500 border-2"
                :class="currentWallet.color === 'purple' ? 'border-purple-800' : 'border-transparent'"
              ></button>
              <button 
                type="button" 
                @click="currentWallet.color = 'orange'" 
                class="w-8 h-8 rounded-full bg-orange-500 border-2"
                :class="currentWallet.color === 'orange' ? 'border-orange-800' : 'border-transparent'"
              ></button>
              <button 
                type="button" 
                @click="currentWallet.color = 'emerald'" 
                class="w-8 h-8 rounded-full bg-emerald-500 border-2"
                :class="currentWallet.color === 'emerald' ? 'border-emerald-800' : 'border-transparent'"
              ></button>
              <button 
                type="button" 
                @click="currentWallet.color = 'red'" 
                class="w-8 h-8 rounded-full bg-red-500 border-2"
                :class="currentWallet.color === 'red' ? 'border-red-800' : 'border-transparent'"
              ></button>
            </div>
          </div>
          
          <div class="flex gap-3 mt-2">
            <button 
              type="submit" 
              class="flex-1 rounded-xl border border-indigo-600 bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
            >
              Simpan
            </button>
            <button 
              type="button" 
              @click="closeWalletModal"
              class="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring"
            >
              Batal
            </button>
          </div>
          
          <button 
            v-if="showEditWalletModal" 
            type="button" 
            @click="confirmDeleteWallet"
            class="rounded-xl border border-red-600 bg-white px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring"
          >
            Hapus Kantong
          </button>
        </form>
        
        <button 
          @click="closeWalletModal" 
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Confirmation Modal for Delete -->
    <div v-if="showDeleteConfirmation" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Konfirmasi Hapus</h3>
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus kantong ini? Semua transaksi terkait juga akan dihapus.</p>
        
        <div class="flex gap-3">
          <button 
            @click="deleteWallet"
            class="flex-1 rounded-xl border border-red-600 bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring"
          >
            Ya, Hapus
          </button>
          <button 
            @click="showDeleteConfirmation = false"
            class="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFinanceStore } from '~/stores/financeStore';

const store = useFinanceStore();

const wallets = computed(() => store.wallets);

// Modal states
const showAddWalletModal = ref(false);
const showEditWalletModal = ref(false);
const showDeleteConfirmation = ref(false);

// Current wallet being edited
const currentWallet = ref({
  nama: '',
  saldo: 0,
  icon: 'bank',
  color: 'blue'
});

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('IDR', 'Rp');
};

// Open edit wallet modal
const editWallet = (wallet) => {
  currentWallet.value = { ...wallet };
  showEditWalletModal.value = true;
};

// Close wallet modal
const closeWalletModal = () => {
  showAddWalletModal.value = false;
  showEditWalletModal.value = false;
  currentWallet.value = {
    nama: '',
    saldo: 0,
    icon: 'bank',
    color: 'blue'
  };
};

// Save wallet (add or update)
const saveWallet = () => {
  if (showEditWalletModal.value) {
    store.updateWallet(currentWallet.value.id, currentWallet.value);
  } else {
    store.addWallet(currentWallet.value);
  }
  closeWalletModal();
};

// Confirm delete wallet
const confirmDeleteWallet = () => {
  showDeleteConfirmation.value = true;
};

// Delete wallet
const deleteWallet = () => {
  const result = store.deleteWallet(currentWallet.value.id);
  showDeleteConfirmation.value = false;
  
  if (result.success) {
    closeWalletModal();
  } else {
    alert(result.message || 'Gagal menghapus kantong');
  }
};
</script>