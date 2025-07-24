import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    wallets: [
      { id: '1', nama: 'Tabungan Bank', saldo: 3500000, icon: 'bank', color: 'blue' },
      { id: '2', nama: 'Dompet Fisik', saldo: 250000, icon: 'wallet', color: 'purple' },
      { id: '3', nama: 'Bank Digital', saldo: 2000000, icon: 'digital', color: 'orange' }
    ],
    transactions: [],
    categories: [
      { id: '1', name: 'Makanan & Minuman', type: 'expense', icon: 'food' },
      { id: '2', name: 'Transportasi', type: 'expense', icon: 'transport' },
      { id: '3', name: 'Belanja', type: 'expense', icon: 'shopping' },
      { id: '4', name: 'Kebutuhan Rumah Tangga', type: 'expense', icon: 'home' },
      { id: '5', name: 'Hiburan', type: 'expense', icon: 'entertainment' },
      { id: '6', name: 'Kesehatan', type: 'expense', icon: 'health' },
      { id: '7', name: 'Pendidikan', type: 'expense', icon: 'education' },
      { id: '8', name: 'Pendapatan Utama', type: 'income', icon: 'salary' },
      { id: '9', name: 'Pendapatan Sampingan', type: 'income', icon: 'side-income' },
      { id: '10', name: 'Hadiah', type: 'income', icon: 'gift' },
      { id: '11', name: 'Investasi', type: 'income', icon: 'investment' }
    ],
    shoppingLists: []
  }),

  getters: {
    totalBalance: (state) => {
      return state.wallets.reduce((total, wallet) => total + wallet.saldo, 0);
    },
    
    monthlyIncome: (state) => {
      const currentMonth = dayjs().format('MM');
      const currentYear = dayjs().format('YYYY');
      
      return state.transactions
        .filter(trx => {
          const trxDate = dayjs(trx.tanggal);
          return trx.tipe === 'income' && 
                 trxDate.format('MM') === currentMonth && 
                 trxDate.format('YYYY') === currentYear;
        })
        .reduce((total, trx) => total + trx.jumlah, 0);
    },
    
    monthlyExpense: (state) => {
      const currentMonth = dayjs().format('MM');
      const currentYear = dayjs().format('YYYY');
      
      return state.transactions
        .filter(trx => {
          const trxDate = dayjs(trx.tanggal);
          return trx.tipe === 'expense' && 
                 trxDate.format('MM') === currentMonth && 
                 trxDate.format('YYYY') === currentYear;
        })
        .reduce((total, trx) => total + trx.jumlah, 0);
    },
    
    recentTransactions: (state) => {
      return [...state.transactions]
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        .slice(0, 5);
    },

    getWalletById: (state) => (id) => {
      return state.wallets.find(wallet => wallet.id === id);
    },

    getCategoryById: (state) => (id) => {
      return state.categories.find(cat => cat.id === id);
    },

    getTransactionsByMonth: (state) => (month, year) => {
      return state.transactions.filter(trx => {
        const trxDate = dayjs(trx.tanggal);
        return trxDate.format('MM') === month && trxDate.format('YYYY') === year;
      });
    },

    getExpensesByCategory: (state) => (month, year) => {
      const transactions = state.transactions.filter(trx => {
        const trxDate = dayjs(trx.tanggal);
        return trx.tipe === 'expense' && 
               trxDate.format('MM') === month && 
               trxDate.format('YYYY') === year;
      });

      const result = {};
      transactions.forEach(trx => {
        if (!result[trx.kategori]) {
          result[trx.kategori] = 0;
        }
        result[trx.kategori] += trx.jumlah;
      });

      return result;
    }
  },

  actions: {
    initializeStore() {
      const storedData = localStorage.getItem('finapp_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        this.wallets = data.wallets || this.wallets;
        this.transactions = data.transactions || [];
        this.categories = data.categories || this.categories;
        this.shoppingLists = data.shoppingLists || [];
      }
    },

    saveToLocalStorage() {
      localStorage.setItem('finapp_data', JSON.stringify({
        wallets: this.wallets,
        transactions: this.transactions,
        categories: this.categories,
        shoppingLists: this.shoppingLists
      }));
    },

    addTransaction(transaction) {
      const newTransaction = {
        id: uuidv4(),
        tanggal: transaction.tanggal || dayjs().format('YYYY-MM-DD'),
        ...transaction
      };

      this.transactions.push(newTransaction);

      // Update wallet balance
      const wallet = this.wallets.find(w => w.id === transaction.kantong);
      if (wallet) {
        if (transaction.tipe === 'income') {
          wallet.saldo += transaction.jumlah;
        } else if (transaction.tipe === 'expense') {
          wallet.saldo -= transaction.jumlah;
        }
      }

      this.saveToLocalStorage();
      return newTransaction;
    },

    updateTransaction(id, updatedData) {
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        const oldTransaction = this.transactions[index];
        
        // Revert the old transaction's effect on wallet
        const oldWallet = this.wallets.find(w => w.id === oldTransaction.kantong);
        if (oldWallet) {
          if (oldTransaction.tipe === 'income') {
            oldWallet.saldo -= oldTransaction.jumlah;
          } else if (oldTransaction.tipe === 'expense') {
            oldWallet.saldo += oldTransaction.jumlah;
          }
        }

        // Apply the new transaction's effect on wallet
        const newWallet = this.wallets.find(w => w.id === updatedData.kantong);
        if (newWallet) {
          if (updatedData.tipe === 'income') {
            newWallet.saldo += updatedData.jumlah;
          } else if (updatedData.tipe === 'expense') {
            newWallet.saldo -= updatedData.jumlah;
          }
        }

        // Update the transaction
        this.transactions[index] = { ...oldTransaction, ...updatedData };
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },

    deleteTransaction(id) {
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        const transaction = this.transactions[index];
        
        // Update wallet balance
        const wallet = this.wallets.find(w => w.id === transaction.kantong);
        if (wallet) {
          if (transaction.tipe === 'income') {
            wallet.saldo -= transaction.jumlah;
          } else if (transaction.tipe === 'expense') {
            wallet.saldo += transaction.jumlah;
          }
        }

        this.transactions.splice(index, 1);
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },

    addWallet(wallet) {
      const newWallet = {
        id: uuidv4(),
        ...wallet
      };
      this.wallets.push(newWallet);
      this.saveToLocalStorage();
      return newWallet;
    },

    updateWallet(id, updatedData) {
      const index = this.wallets.findIndex(w => w.id === id);
      if (index !== -1) {
        this.wallets[index] = { ...this.wallets[index], ...updatedData };
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },

    deleteWallet(id) {
      // Check if wallet has transactions
      const hasTransactions = this.transactions.some(t => t.kantong === id);
      if (hasTransactions) {
        return { success: false, message: 'Tidak dapat menghapus kantong yang memiliki transaksi' };
      }

      const index = this.wallets.findIndex(w => w.id === id);
      if (index !== -1) {
        this.wallets.splice(index, 1);
        this.saveToLocalStorage();
        return { success: true };
      }
      return { success: false, message: 'Kantong tidak ditemukan' };
    },

    addShoppingList(list) {
      const newList = {
        id: uuidv4(),
        createdAt: dayjs().format('YYYY-MM-DD'),
        completed: false,
        ...list
      };
      this.shoppingLists.push(newList);
      this.saveToLocalStorage();
      return newList;
    },

    updateShoppingList(id, updatedData) {
      const index = this.shoppingLists.findIndex(l => l.id === id);
      if (index !== -1) {
        this.shoppingLists[index] = { ...this.shoppingLists[index], ...updatedData };
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },

    deleteShoppingList(id) {
      const index = this.shoppingLists.findIndex(l => l.id === id);
      if (index !== -1) {
        this.shoppingLists.splice(index, 1);
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },

    importData(data) {
      if (data.wallets && Array.isArray(data.wallets)) {
        this.wallets = data.wallets;
      }
      
      if (data.transactions && Array.isArray(data.transactions)) {
        this.transactions = data.transactions;
      }
      
      if (data.categories && Array.isArray(data.categories)) {
        this.categories = data.categories;
      }
      
      if (data.shoppingLists && Array.isArray(data.shoppingLists)) {
        this.shoppingLists = data.shoppingLists;
      }
      
      // Simpan informasi impor
      const importInfo = {
        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        source: 'JSON Import',
        user: this.getUserName()
      };
      localStorage.setItem('finapp_last_import', JSON.stringify(importInfo));
      
      this.saveToLocalStorage();
      return true;
    },

    importCSV(transactions) {
      if (Array.isArray(transactions)) {
        this.transactions = transactions;
        
        // Simpan informasi impor
        const importInfo = {
          date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          source: 'CSV Import',
          user: this.getUserName()
        };
        localStorage.setItem('finapp_last_import', JSON.stringify(importInfo));
        
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },
    
    getUserName() {
      const savedProfile = localStorage.getItem('finapp_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        return profile.name || 'Pengguna';
      }
      return 'Pengguna';
    },
    
    // Category management
    addCategory(category) {
      const newCategory = {
        id: uuidv4(),
        ...category
      };
      this.categories.push(newCategory);
      this.saveToLocalStorage();
      return newCategory;
    },
    
    updateCategory(id, updatedData) {
      const index = this.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        this.categories[index] = { ...this.categories[index], ...updatedData };
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },
    
    deleteCategory(id) {
      // Check if category is used in transactions
      const isUsed = this.transactions.some(t => t.kategori === id);
      if (isUsed) {
        return { success: false, message: 'Tidak dapat menghapus kategori yang digunakan dalam transaksi' };
      }
      
      const index = this.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        this.categories.splice(index, 1);
        this.saveToLocalStorage();
        return { success: true };
      }
      return { success: false, message: 'Kategori tidak ditemukan' };
    },
    
    resetStore() {
      // Reset to initial state
      this.wallets = [
        { id: '1', nama: 'Tabungan Bank', saldo: 3500000, icon: 'bank', color: 'blue' },
        { id: '2', nama: 'Dompet Fisik', saldo: 250000, icon: 'wallet', color: 'purple' },
        { id: '3', nama: 'Bank Digital', saldo: 2000000, icon: 'digital', color: 'orange' }
      ];
      this.transactions = [];
      this.categories = [
        { id: '1', name: 'Makanan & Minuman', type: 'expense', icon: 'food' },
        { id: '2', name: 'Transportasi', type: 'expense', icon: 'transport' },
        { id: '3', name: 'Belanja', type: 'expense', icon: 'shopping' },
        { id: '4', name: 'Kebutuhan Rumah Tangga', type: 'expense', icon: 'home' },
        { id: '5', name: 'Hiburan', type: 'expense', icon: 'entertainment' },
        { id: '6', name: 'Kesehatan', type: 'expense', icon: 'health' },
        { id: '7', name: 'Pendidikan', type: 'expense', icon: 'education' },
        { id: '8', name: 'Pendapatan Utama', type: 'income', icon: 'salary' },
        { id: '9', name: 'Pendapatan Sampingan', type: 'income', icon: 'side-income' },
        { id: '10', name: 'Hadiah', type: 'income', icon: 'gift' },
        { id: '11', name: 'Investasi', type: 'income', icon: 'investment' }
      ];
      this.shoppingLists = [];
      
      // Clear export history
      localStorage.removeItem('finapp_export_history');
      localStorage.removeItem('finapp_last_import');
      
      this.saveToLocalStorage();
    }
  }
});