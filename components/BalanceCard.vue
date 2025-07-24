<template>
  <div class="p-6 border-b border-gray-200">
    <div class="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring bg-white">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Saldo Saat Ini</h2>
      <p class="text-4xl font-extrabold text-emerald-700">{{ formatCurrency(totalBalance) }}</p>
      <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Pendapatan Bulan Ini: <span class="font-semibold text-green-600">{{ formatCurrency(monthlyIncome) }}</span></span>
        <span>Pengeluaran Bulan Ini: <span class="font-semibold text-red-600">{{ formatCurrency(monthlyExpense) }}</span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFinanceStore } from '~/stores/financeStore';

const store = useFinanceStore();

const totalBalance = computed(() => store.totalBalance);
const monthlyIncome = computed(() => store.monthlyIncome);
const monthlyExpense = computed(() => store.monthlyExpense);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('IDR', 'Rp');
};
</script>