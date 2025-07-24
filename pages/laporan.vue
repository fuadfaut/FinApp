<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-emerald-600 text-white p-4 rounded-b-2xl shadow-md">
      <h1 class="text-xl font-bold">Laporan Keuangan</h1>
      <p class="text-sm opacity-80">Analisis pengeluaran dan pemasukan</p>
    </div>

    <div class="container mx-auto px-4 py-6 max-w-md">
      <!-- Period Selector -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold text-gray-800">Periode</h2>
        </div>
        <div class="flex gap-2">
          <button 
            v-for="period in periods" 
            :key="period.value" 
            @click="selectedPeriod = period.value"
            :class="[
              'px-3 py-2 text-sm rounded-lg flex-1 transition-colors',
              selectedPeriod === period.value 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- Income vs Expense Chart -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Pemasukan vs Pengeluaran</h2>
        </div>
        <div class="h-64">
          <canvas ref="incomeExpenseChart"></canvas>
        </div>
      </div>

      <!-- Expense by Category Chart -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Pengeluaran per Kategori</h2>
        </div>
        <div class="h-64">
          <canvas ref="categoryChart"></canvas>
        </div>
      </div>

      <!-- Expense by Wallet Chart -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Pengeluaran per Kantong</h2>
        </div>
        <div class="h-64">
          <canvas ref="walletChart"></canvas>
        </div>
      </div>

      <!-- Transaction Summary -->
      <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Ringkasan Transaksi</h2>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-50 p-3 rounded-lg">
            <p class="text-sm text-green-700">Total Pemasukan</p>
            <p class="text-xl font-bold text-green-700">{{ formatCurrency(periodIncome) }}</p>
          </div>
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="text-sm text-red-700">Total Pengeluaran</p>
            <p class="text-xl font-bold text-red-700">{{ formatCurrency(periodExpense) }}</p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-blue-700">Transaksi Terbesar</p>
            <p class="text-xl font-bold text-blue-700">{{ formatCurrency(largestTransaction?.jumlah || 0) }}</p>
            <p class="text-xs text-blue-600 truncate">{{ largestTransaction?.deskripsi || '-' }}</p>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg">
            <p class="text-sm text-purple-700">Kategori Terbesar</p>
            <p class="text-xl font-bold text-purple-700">{{ formatCurrency(largestCategory.amount) }}</p>
            <p class="text-xs text-purple-600">{{ largestCategory.name || '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <FooterNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useFinanceStore } from '~/stores/financeStore';
import FooterNav from '~/components/FooterNav.vue';
import dayjs from 'dayjs';
import Chart from 'chart.js/auto';

const store = useFinanceStore();

// Chart references
const incomeExpenseChart = ref(null);
const categoryChart = ref(null);
const walletChart = ref(null);

// Chart instances
let incomeExpenseChartInstance = null;
let categoryChartInstance = null;
let walletChartInstance = null;

// Period selection
const periods = [
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: '3 Bulan', value: 'quarter' },
  { label: 'Tahun Ini', value: 'year' }
];
const selectedPeriod = ref('month');

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Filter transactions by period
const filteredTransactions = computed(() => {
  const now = dayjs();
  let startDate;

  switch (selectedPeriod.value) {
    case 'week':
      startDate = now.subtract(1, 'week');
      break;
    case 'month':
      startDate = now.startOf('month');
      break;
    case 'quarter':
      startDate = now.subtract(3, 'month');
      break;
    case 'year':
      startDate = now.startOf('year');
      break;
    default:
      startDate = now.startOf('month');
  }

  return store.transactions.filter(trx => {
    return dayjs(trx.tanggal).isAfter(startDate);
  });
});

// Calculate period income and expense
const periodIncome = computed(() => {
  return filteredTransactions.value
    .filter(trx => trx.tipe === 'pemasukan')
    .reduce((sum, trx) => sum + trx.jumlah, 0);
});

const periodExpense = computed(() => {
  return filteredTransactions.value
    .filter(trx => trx.tipe === 'pengeluaran')
    .reduce((sum, trx) => sum + trx.jumlah, 0);
});

// Get largest transaction
const largestTransaction = computed(() => {
  if (filteredTransactions.value.length === 0) return null;
  
  return [...filteredTransactions.value].sort((a, b) => b.jumlah - a.jumlah)[0];
});

// Get largest expense category
const largestCategory = computed(() => {
  const expensesByCategory = {};
  
  filteredTransactions.value
    .filter(trx => trx.tipe === 'pengeluaran')
    .forEach(trx => {
      if (!expensesByCategory[trx.kategori]) {
        expensesByCategory[trx.kategori] = 0;
      }
      expensesByCategory[trx.kategori] += trx.jumlah;
    });
  
  let maxCategory = { name: '-', amount: 0 };
  
  for (const [category, amount] of Object.entries(expensesByCategory)) {
    if (amount > maxCategory.amount) {
      maxCategory = { name: category, amount };
    }
  }
  
  return maxCategory;
});

// Create income vs expense chart
const createIncomeExpenseChart = () => {
  if (incomeExpenseChartInstance) {
    incomeExpenseChartInstance.destroy();
  }
  
  const ctx = incomeExpenseChart.value.getContext('2d');
  
  // Group by month or day based on period
  const groupBy = selectedPeriod.value === 'week' ? 'day' : 'month';
  const format = selectedPeriod.value === 'week' ? 'DD MMM' : 'MMM YYYY';
  
  // Prepare data
  const groupedData = {};
  
  filteredTransactions.value.forEach(trx => {
    const date = dayjs(trx.tanggal).format(format);
    
    if (!groupedData[date]) {
      groupedData[date] = { income: 0, expense: 0 };
    }
    
    if (trx.tipe === 'pemasukan') {
      groupedData[date].income += trx.jumlah;
    } else {
      groupedData[date].expense += trx.jumlah;
    }
  });
  
  const labels = Object.keys(groupedData);
  const incomeData = labels.map(date => groupedData[date].income);
  const expenseData = labels.map(date => groupedData[date].expense);
  
  incomeExpenseChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        },
        {
          label: 'Pengeluaran',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value >= 1000000 
                ? (value / 1000000).toFixed(0) + ' Jt' 
                : value >= 1000 
                  ? (value / 1000).toFixed(0) + ' Rb' 
                  : value;
            }
          }
        }
      }
    }
  });
};

// Create category chart
const createCategoryChart = () => {
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }
  
  const ctx = categoryChart.value.getContext('2d');
  
  // Prepare data
  const expensesByCategory = {};
  
  filteredTransactions.value
    .filter(trx => trx.tipe === 'pengeluaran')
    .forEach(trx => {
      if (!expensesByCategory[trx.kategori]) {
        expensesByCategory[trx.kategori] = 0;
      }
      expensesByCategory[trx.kategori] += trx.jumlah;
    });
  
  const labels = Object.keys(expensesByCategory);
  const data = labels.map(category => expensesByCategory[category]);
  
  // Generate colors
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(199, 199, 199, 0.7)',
    'rgba(83, 102, 255, 0.7)',
    'rgba(40, 159, 64, 0.7)',
    'rgba(210, 199, 199, 0.7)'
  ];
  
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

// Create wallet chart
const createWalletChart = () => {
  if (walletChartInstance) {
    walletChartInstance.destroy();
  }
  
  const ctx = walletChart.value.getContext('2d');
  
  // Prepare data
  const expensesByWallet = {};
  
  filteredTransactions.value
    .filter(trx => trx.tipe === 'pengeluaran')
    .forEach(trx => {
      if (!expensesByWallet[trx.kantong]) {
        expensesByWallet[trx.kantong] = 0;
      }
      expensesByWallet[trx.kantong] += trx.jumlah;
    });
  
  const labels = Object.keys(expensesByWallet);
  const data = labels.map(wallet => expensesByWallet[wallet]);
  
  // Generate colors
  const backgroundColors = [
    'rgba(16, 185, 129, 0.7)',
    'rgba(59, 130, 246, 0.7)',
    'rgba(249, 115, 22, 0.7)',
    'rgba(139, 92, 246, 0.7)',
    'rgba(236, 72, 153, 0.7)',
    'rgba(245, 158, 11, 0.7)',
    'rgba(6, 182, 212, 0.7)',
    'rgba(168, 85, 247, 0.7)',
    'rgba(232, 121, 249, 0.7)',
    'rgba(217, 119, 6, 0.7)'
  ];
  
  walletChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

// Update charts when period changes
watch(selectedPeriod, () => {
  createIncomeExpenseChart();
  createCategoryChart();
  createWalletChart();
});

// Initialize charts on mount
onMounted(() => {
  createIncomeExpenseChart();
  createCategoryChart();
  createWalletChart();
});
</script>