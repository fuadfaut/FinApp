<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-indigo-600 text-white p-4 rounded-b-2xl shadow-md">
      <h1 class="text-xl font-bold">Ekspor & Impor Data</h1>
      <p class="text-sm opacity-80">Kelola data keuangan Anda</p>
    </div>

    <div class="container mx-auto px-4 py-6 max-w-md">
      <!-- Export Section -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Ekspor Data</h2>
        <p class="text-sm text-gray-600 mb-4">Ekspor data keuangan Anda untuk cadangan atau transfer ke perangkat lain.</p>
        
        <div class="flex flex-col gap-3">
          <button @click="exportJson" class="inline-block rounded-xl border border-emerald-600 bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              Ekspor Data (JSON)
            </div>
          </button>
          <button @click="exportCsv" class="inline-block rounded-xl border border-indigo-600 bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              Ekspor Data (CSV)
            </div>
          </button>
        </div>
      </div>

      <!-- Import Section -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Impor Data</h2>
        <p class="text-sm text-gray-600 mb-4">Impor data keuangan dari file JSON atau CSV.</p>
        
        <label class="block">
          <span class="block text-sm font-medium text-gray-700 mb-1">Pilih File (JSON/CSV)</span>
          <input ref="importFileInput" type="file" accept=".json,.csv" @change="handleFileImport" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2.5" />
        </label>

        <div class="mt-4">
          <div v-if="importStatus.message" class="p-3 rounded-lg" :class="importStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            <div class="flex items-center">
              <svg v-if="importStatus.success" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              {{ importStatus.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Export History -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Riwayat Ekspor</h2>
        <div v-if="exportHistory.length === 0" class="text-center py-4 text-gray-500">
          Belum ada riwayat ekspor data.
        </div>
        <div v-else class="space-y-3">
          <div v-for="(history, index) in exportHistory" :key="index" class="p-3 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-800">{{ history.type === 'json' ? 'Ekspor JSON' : 'Ekspor CSV' }}</p>
                <p class="text-sm text-gray-600">{{ history.date }}</p>
                <p class="text-xs text-gray-500">Oleh: {{ history.user || 'Pengguna' }}</p>
              </div>
              <div class="text-xs px-2 py-1 rounded" :class="history.type === 'json' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'">
                {{ history.type.toUpperCase() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFinanceStore } from '~/stores/financeStore';
import FooterNav from '~/components/FooterNav.vue';
import dayjs from 'dayjs';

const store = useFinanceStore();

// Import file input ref
const importFileInput = ref(null);

// Import status
const importStatus = ref({
  message: '',
  success: false
});

// Export history
const exportHistory = ref([]);

// Load export history from localStorage
onMounted(() => {
  const savedHistory = localStorage.getItem('finapp_export_history');
  if (savedHistory) {
    exportHistory.value = JSON.parse(savedHistory);
  }
});

// Get user profile
const getUserName = () => {
  const savedProfile = localStorage.getItem('finapp_profile');
  if (savedProfile) {
    const profile = JSON.parse(savedProfile);
    return profile.name || 'Pengguna';
  }
  return 'Pengguna';
};

// Add export to history
const addExportToHistory = (type) => {
  const newExport = {
    type,
    date: dayjs().format('DD MMM YYYY HH:mm:ss'),
    user: getUserName()
  };
  
  exportHistory.value.unshift(newExport);
  if (exportHistory.value.length > 10) {
    exportHistory.value = exportHistory.value.slice(0, 10);
  }
  
  localStorage.setItem('finapp_export_history', JSON.stringify(exportHistory.value));
};

// Export JSON
const exportJson = () => {
  const data = {
    wallets: store.wallets,
    transactions: store.transactions,
    categories: store.categories,
    shoppingLists: store.shoppingLists || [],
    exportInfo: {
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      user: getUserName()
    }
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finapp_data_${dayjs().format('YYYY-MM-DD_HHmmss')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addExportToHistory('json');
};

// Export CSV
const exportCsv = () => {
  const rows = [
    ['id', 'tanggal', 'jumlah', 'tipe', 'kategori', 'deskripsi', 'kantong', 'export_date', 'export_user']
  ];
  
  const exportDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const exportUser = getUserName();
  
  store.transactions.forEach(trx => {
    rows.push([
      trx.id,
      trx.tanggal,
      trx.jumlah,
      trx.tipe,
      trx.kategori,
      trx.deskripsi,
      trx.kantong,
      exportDate,
      exportUser
    ]);
  });
  
  const csv = rows.map(r => r.map(v => '"' + String(v || '').replace(/"/g, '""') + '"').join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finapp_transactions_${dayjs().format('YYYY-MM-DD_HHmmss')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addExportToHistory('csv');
};

// Handle file import
const handleFileImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      let imported;
      if (file.name.endsWith('.json')) {
        imported = JSON.parse(evt.target.result);
        if (!imported.transactions || !imported.wallets) {
          throw 'Format JSON tidak sesuai!';
        }
        store.importData(imported);
        importStatus.value = {
          message: 'Data JSON berhasil diimpor!',
          success: true
        };
      } else if (file.name.endsWith('.csv')) {
        // CSV hanya untuk transaksi
        const lines = evt.target.result.split(/\r?\n/).filter(Boolean);
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        if (headers.length < 7) {
          throw 'Header CSV tidak sesuai!';
        }
        const transactions = lines.slice(1).map(line => {
          const cols = line.match(/([^,]+)/g).map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"'));
          return {
            id: cols[0],
            tanggal: cols[1],
            jumlah: Number(cols[2]),
            tipe: cols[3],
            kategori: cols[4],
            deskripsi: cols[5],
            kantong: cols[6]
          };
        });
        store.importCSV(transactions);
        importStatus.value = {
          message: 'Data CSV berhasil diimpor!',
          success: true
        };
      } else {
        throw 'Format file tidak didukung!';
      }
    } catch (err) {
      importStatus.value = {
        message: 'Gagal impor: ' + err,
        success: false
      };
    }
    
    // Reset file input
    if (importFileInput.value) {
      importFileInput.value.value = '';
    }
  };
  reader.readAsText(file);
};
</script>