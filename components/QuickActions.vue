<template>
  <div class="p-6 grid grid-cols-2 gap-4 border-b border-gray-200">
    <button
      @click="showIncomeModal = true"
      class="inline-block rounded-xl border border-emerald-600 bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500"
    >
      + Tambah Pendapatan
    </button>
    <button
      @click="showExpenseModal = true"
      class="inline-block rounded-xl border border-rose-600 bg-rose-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-rose-600 focus:outline-none focus:ring active:text-rose-500"
    >
      - Tambah Pengeluaran
    </button>
    <button
      @click="showShoppingListModal = true"
      class="col-span-2 inline-block rounded-xl border border-indigo-600 bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
    >
      📝 Buat List Belanja
    </button>

    <!-- Modal untuk Tambah Pendapatan -->
    <div v-if="showIncomeModal" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Tambah Pendapatan</h3>
        <form @submit.prevent="addIncome" class="flex flex-col gap-4">
          <div>
            <label for="incomeDesc" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <input 
              type="text" 
              id="incomeDesc" 
              v-model="incomeForm.deskripsi" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contoh: Gaji Bulanan"
            >
          </div>
          
          <div>
            <label for="incomeAmount" class="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <input 
              type="number" 
              id="incomeAmount" 
              v-model.number="incomeForm.jumlah" 
              required
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contoh: 5000000"
            >
          </div>
          
          <div>
            <label for="incomeCategory" class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              id="incomeCategory" 
              v-model="incomeForm.kategori" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Pilih Kategori</option>
              <option 
                v-for="category in incomeCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="incomeWallet" class="block text-sm font-medium text-gray-700 mb-1">Masuk ke Kantong</label>
            <select 
              id="incomeWallet" 
              v-model="incomeForm.kantong" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Pilih Kantong</option>
              <option 
                v-for="wallet in wallets" 
                :key="wallet.id" 
                :value="wallet.id"
              >
                {{ wallet.nama }} ({{ formatCurrency(wallet.saldo) }})
              </option>
            </select>
          </div>
          
          <div>
            <label for="incomeDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input 
              type="date" 
              id="incomeDate" 
              v-model="incomeForm.tanggal" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div class="flex gap-3 mt-2">
            <button 
              type="submit" 
              class="flex-1 rounded-xl border border-emerald-600 bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring"
            >
              Simpan
            </button>
            <button 
              type="button" 
              @click="showIncomeModal = false"
              class="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring"
            >
              Batal
            </button>
          </div>
        </form>
        
        <button 
          @click="showIncomeModal = false" 
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal untuk Tambah Pengeluaran -->
    <div v-if="showExpenseModal" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Tambah Pengeluaran</h3>
        
        <div class="flex flex-col gap-4">
          <button
            @click="showExpenseFormModal = true; showExpenseModal = false"
            class="inline-block w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring active:bg-gray-100"
          >
            Input Manual
          </button>
          <button
            class="inline-block w-full rounded-xl border border-indigo-600 bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          >
            Scan Struk (OCR)
          </button>
        </div>
        
        <button
          @click="showExpenseModal = false"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal untuk Form Pengeluaran -->
    <div v-if="showExpenseFormModal" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Input Pengeluaran Manual</h3>
        <form @submit.prevent="addExpense" class="flex flex-col gap-4">
          <div>
            <label for="expenseDesc" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <input 
              type="text" 
              id="expenseDesc" 
              v-model="expenseForm.deskripsi" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contoh: Belanja Bulanan"
            >
          </div>
          
          <div>
            <label for="expenseAmount" class="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
            <input 
              type="number" 
              id="expenseAmount" 
              v-model.number="expenseForm.jumlah" 
              required
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contoh: 150000"
            >
          </div>
          
          <div>
            <label for="expenseCategory" class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              id="expenseCategory" 
              v-model="expenseForm.kategori" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Pilih Kategori</option>
              <option 
                v-for="category in expenseCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="expenseWallet" class="block text-sm font-medium text-gray-700 mb-1">Ambil dari Kantong</label>
            <select 
              id="expenseWallet" 
              v-model="expenseForm.kantong" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Pilih Kantong</option>
              <option 
                v-for="wallet in wallets" 
                :key="wallet.id" 
                :value="wallet.id"
              >
                {{ wallet.nama }} ({{ formatCurrency(wallet.saldo) }})
              </option>
            </select>
          </div>
          
          <div>
            <label for="expenseDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input 
              type="date" 
              id="expenseDate" 
              v-model="expenseForm.tanggal" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div class="flex gap-3 mt-2">
            <button 
              type="submit" 
              class="flex-1 rounded-xl border border-rose-600 bg-rose-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring"
            >
              Simpan
            </button>
            <button 
              type="button" 
              @click="showExpenseFormModal = false"
              class="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring"
            >
              Batal
            </button>
          </div>
        </form>
        
        <button 
          @click="showExpenseFormModal = false" 
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal untuk Buat List Belanja -->
    <div v-if="showShoppingListModal" class="modal-overlay show">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Buat List Belanja</h3>
        <form @submit.prevent="addShoppingList" class="flex flex-col gap-4">
          <div>
            <label for="listName" class="block text-sm font-medium text-gray-700 mb-1">Nama List</label>
            <input 
              type="text" 
              id="listName" 
              v-model="shoppingListForm.nama" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contoh: Belanja Mingguan"
            >
          </div>
          
          <div>
            <label for="listBudget" class="block text-sm font-medium text-gray-700 mb-1">Budget (Rp)</label>
            <input 
              type="number" 
              id="listBudget" 
              v-model.number="shoppingListForm.budget" 
              required
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contoh: 500000"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Item Belanja</label>
            <div v-for="(item, index) in shoppingListForm.items" :key="index" class="flex gap-2 mb-2">
              <input 
                type="text" 
                v-model="item.nama" 
                required
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nama item"
              >
              <input 
                type="number" 
                v-model.number="item.estimasi" 
                required
                min="1"
                class="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Rp"
              >
              <button 
                type="button" 
                @click="removeShoppingItem(index)"
                class="p-2 text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <button 
              type="button" 
              @click="addShoppingItem"
              class="mt-2 inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring"
            >
              + Tambah Item
            </button>
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
              @click="showShoppingListModal = false"
              class="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring"
            >
              Batal
            </button>
          </div>
        </form>
        
        <button 
          @click="showShoppingListModal = false" 
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFinanceStore } from '~/stores/financeStore';
import dayjs from 'dayjs';

const store = useFinanceStore();

// Modal states
const showIncomeModal = ref(false);
const showExpenseModal = ref(false);
const showExpenseFormModal = ref(false);
const showShoppingListModal = ref(false);

// Form data
const incomeForm = ref({
  deskripsi: '',
  jumlah: null,
  kategori: '',
  kantong: '',
  tanggal: dayjs().format('YYYY-MM-DD'),
  tipe: 'income'
});

const expenseForm = ref({
  deskripsi: '',
  jumlah: null,
  kategori: '',
  kantong: '',
  tanggal: dayjs().format('YYYY-MM-DD'),
  tipe: 'expense'
});

const shoppingListForm = ref({
  nama: '',
  budget: null,
  items: [
    { nama: '', estimasi: null, checked: false }
  ]
});

// Computed properties
const wallets = computed(() => store.wallets);

const incomeCategories = computed(() => {
  return store.categories.filter(cat => cat.type === 'income');
});

const expenseCategories = computed(() => {
  return store.categories.filter(cat => cat.type === 'expense');
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

// Add income
const addIncome = () => {
  store.addTransaction(incomeForm.value);
  showIncomeModal.value = false;
  resetForms();
};

// Add expense
const addExpense = () => {
  store.addTransaction(expenseForm.value);
  showExpenseFormModal.value = false;
  resetForms();
};

// Add shopping list
const addShoppingList = () => {
  store.addShoppingList(shoppingListForm.value);
  showShoppingListModal.value = false;
  resetForms();
};

// Add shopping item
const addShoppingItem = () => {
  shoppingListForm.value.items.push({ nama: '', estimasi: null, checked: false });
};

// Remove shopping item
const removeShoppingItem = (index) => {
  if (shoppingListForm.value.items.length > 1) {
    shoppingListForm.value.items.splice(index, 1);
  }
};

// Reset forms
const resetForms = () => {
  incomeForm.value = {
    deskripsi: '',
    jumlah: null,
    kategori: '',
    kantong: '',
    tanggal: dayjs().format('YYYY-MM-DD'),
    tipe: 'income'
  };
  
  expenseForm.value = {
    deskripsi: '',
    jumlah: null,
    kategori: '',
    kantong: '',
    tanggal: dayjs().format('YYYY-MM-DD'),
    tipe: 'expense'
  };
  
  shoppingListForm.value = {
    nama: '',
    budget: null,
    items: [
      { nama: '', estimasi: null, checked: false }
    ]
  };
};
</script>