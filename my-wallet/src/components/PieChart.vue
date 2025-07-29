<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import { computed } from 'vue'
import { useTransactionStore } from '@/stores/transactions'

const store = useTransactionStore()

const chartData = computed(() => {
  const categoryMap = {}
  store.items.forEach(tx => {
    if (tx.type === 'dépense') {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
    }
  })
  return {
    labels: Object.keys(categoryMap),
    datasets: [{ data: Object.values(categoryMap) }]
  }
})
</script>
