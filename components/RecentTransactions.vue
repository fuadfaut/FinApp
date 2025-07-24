<template>
  <div class="p-6">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Riwayat Transaksi Terbaru</h2>

    <!-- Item Transaksi -->
    <div v-if="recentTransactions.length > 0">
      <div 
        v-for="transaction in recentTransactions" 
        :key="transaction.id"
        @click="showTransactionDetail(transaction)"
        class="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring mb-3 cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div :class="`bg-${transaction.tipe === 'expense' ? 'red' : 'green'}-100 p-2 rounded-full mr-3`">
              <!-- Icon based on category -->
              <svg v-if="transaction.tipe === 'expense'" class="w-6 h-6" :class="`text-${transaction.tipe === 'expense' ? 'red' : 'green'}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <svg v-else class="w-6 h-6" :class="`text-${transaction.tipe === 'expense' ? 'red' : 'green'}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 3v2m0 3.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ transaction.deskripsi }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(transaction.tanggal) }} - {{ getCategoryName(transaction.kategori) }}</p>
            </div>
          </div>
          <p :class="`font-semibold ${transaction.tipe === 'expense' ? 'text-red-600' : 'text-green-600'}`">
            {{ transaction.tipe === 'expense' ? '- ' : '+ ' }}{{ formatCurrency(transaction.jumlah) }}
          </p>
        </div>
      </div>

      <button
        @click="navigateToAllTransactions"
        class="block w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring active:bg-gray-100"
      >
        Lihat Semua Transaksi
      </button>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-gray-500 mb-4">Belum ada transaksi</p>
      <button
        @click="showQuickActions"
        class="inline-block rounded-xl border border-indigo-600 bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
      >
        Tambah Transaksi Pertama
      </button>
    </div>

    <!-- Modal Detail Transaksi -->
    <div v-if="showDetailModal" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Detail Transaksi</h3>
        
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Deskripsi:</span>
            <span class="font-medium">{{ selectedTransaction.deskripsi }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Jumlah:</span>
            <span :class="`font-medium ${selectedTransaction.tipe === 'expense' ? 'text-red-600' : 'text-green-600'}`">
              {{ selectedTransaction.tipe === 'expense' ? '- ' : '+ ' }}{{ formatCurrency(selectedTransaction.jumlah) }}
            </span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Kategori:</span>
            <span class="font-medium">{{ getCategoryName(selectedTransaction.kategori) }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Kantong:</span>
            <span class="font-medium">{{ getWalletName(selectedTransaction.kantong) }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Tanggal:</span>
            <span class="font-medium">{{ formatDate(selectedTransaction.tanggal) }}</span>
          </div>
          
          <div class="flex gap-3 mt-2">
            <button 
              @click="editTransaction"
              class="flex-1 rounded-xl border border-indigo-600 bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
            >
              Edit
            </button>
            <button 
              @click="confirmDeleteTransaction"
              class="flex-1 rounded-xl border border-red-600 bg-white px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring"
            >
              Hapus
            </button>
          </div>
        </div>
        
        <button 
          @click="showDetailModal = false" 
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal Edit Transaksi -->
    <div v-if="showEditModal" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Edit Transaksi</h3>
        
        <form @submit.prevent="updateTransaction" class="flex flex-col gap-4">
          <div>
            <label for="editDesc" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <input 
              type="text" 
              id="editDesc" 
              v-model="editForm.deskripsi" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div>
            <label for="editAmount" class="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <input 
              type="number" 
              id="editAmount" 
              v-model.number="editForm.jumlah" 
              required
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div>
            <label for="editCategory" class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              id="editCategory" 
              v-model="editForm.kategori" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option 
                v-for="category in editForm.tipe === 'income' ? incomeCategories : expenseCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="editWallet" class="block text-sm font-medium text-gray-700 mb-1">
              {{ editForm.tipe === 'income' ? 'Masuk ke Kantong' : 'Ambil dari Kantong' }}
            </label>
            <select 
              id="editWallet" 
              v-model="editForm.kantong" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option 
                v-for="wallet in wallets" 
                :key="wallet.id" 
                :value="wallet.id"
              >
                {{ wallet.nama }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="editDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input 
              type="date" 
              id="editDate" 
              v-model="editForm.tanggal" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
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
              @click="showEditModal = false"
              class="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring"
            >
              Batal
            </button>
          </div>
        </form>
        
        <button 
          @click="showEditModal = false" 
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
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus transaksi ini?</p>
        
        <div class="flex gap-3">
          <button 
            @click="deleteTransaction"
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
import dayjs from 'dayjs';

const store = useFinanceStore();
const emit = defineEmits(['showQuickActions']);

// Computed properties
const recentTransactions = computed(() => store.recentTransactions);
const wallets = computed(() => store.wallets);
const incomeCategories = computed(() => store.categories.filter(cat => cat.type === 'income'));
const expenseCategories = computed(() => store.categories.filter(cat => cat.type === 'expense'));

// Modal states
const showDetailModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirmation = ref(false);

// Selected transaction
const selectedTransaction = ref({});

// Edit form
const editForm = ref({
  id: '',
  deskripsi: '',
  jumlah: 0,
  kategori: '',
  kantong: '',
  tanggal: '',
  tipe: ''
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

// Format date
const formatDate = (dateString) => {
  const date = dayjs(dateString);
  return date.format('DD MMMM YYYY');
};

// Get category name
const getCategoryName = (categoryId) => {
  const category = store.getCategoryById(categoryId);
  return category ? category.name : 'Tidak Diketahui';
};

// Get wallet name
const getWalletName = (walletId) => {
  const wallet = store.getWalletById(walletId);
  return wallet ? wallet.nama : 'Tidak Diketahui';
};

// Show transaction detail
const showTransactionDetail = (transaction) => {
  selectedTransaction.value = transaction;
  showDetailModal.value = true;
};

// Edit transaction
const editTransaction = () => {
  editForm.value = { ...selectedTransaction.value };
  showDetailModal.value = false;
  showEditModal.value = true;
};

// Update transaction
const updateTransaction = () => {
  store.updateTransaction(editForm.value.id, editForm.value);
  showEditModal.value = false;
};

// Confirm delete transaction
const confirmDeleteTransaction = () => {
  showDetailModal.value = false;
  showDeleteConfirmation.value = true;
};

// Delete transaction
const deleteTransaction = () => {
  store.deleteTransaction(selectedTransaction.value.id);
  showDeleteConfirmation.value = false;
};

// Navigate to all transactions
const navigateToAllTransactions = () => {
  // This would be implemented with vue-router
  // For now, we'll just log it
  console.log('Navigate to all transactions');
};

// Show quick actions
const showQuickActions = () => {
  emit('showQuickActions');
};
</script>