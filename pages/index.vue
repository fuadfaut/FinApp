<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <AppHeader />
    <div class="container mx-auto px-4 py-6 max-w-md">
      <BalanceCard />
      <WalletsList />
      <QuickActions />
      <RecentTransactions />
    </div>
    <FooterNav />
  </div>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
import BalanceCard from '~/components/BalanceCard.vue';
import WalletsList from '~/components/WalletsList.vue';
import QuickActions from '~/components/QuickActions.vue';
import RecentTransactions from '~/components/RecentTransactions.vue';
import FooterNav from '~/components/FooterNav.vue';
</script>