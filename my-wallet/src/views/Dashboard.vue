<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '../stores/transactions'
import PieChart from '../components/PieChart.vue'
import { exportCSV, exportExcel } from '../assets/utils/export'

const store = useTransactionStore()
const selectedMonth = ref(new Date().toISOString().slice(0, 7))

onMounted(() => {
  store.fetchTransactions()
})

const filteredTransactions = computed(() => {
  if (!selectedMonth.value) return store.items
  return store.items.filter(tx =>
    tx.date.startsWith(selectedMonth.value)
  )
})

const balance = computed(() => {
  return filteredTransactions.value.reduce((total, tx) => {
    return total + (tx.type === 'revenu' ? tx.amount : -tx.amount)
  }, 0)
})

const filteredExpensesByCategory = computed(() => {
  const map = {}
  filteredTransactions.value.forEach(tx => {
    if (tx.type === 'dépense') {
      map[tx.category] = (map[tx.category] || 0) + tx.amount
    }
  })
  return map
})

const handleExportCSV = () => {
  exportCSV(filteredTransactions.value)
}

const handleExportExcel = () => {
  exportExcel(filteredTransactions.value)
}
</script>


<template>
  <div class="p-4 space-y-6">
    <h1 class="text-2xl font-bold">Tableau de bord</h1>

    <!-- Filtres -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <input
        type="month"
        v-model="selectedMonth"
        class="border rounded p-2 w-full sm:w-auto"
      />
      <button
        @click="handleExportCSV"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Export CSV
      </button>
      <button
        @click="handleExportExcel"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Export Excel
      </button>
    </div>

    <!-- Solde courant -->
    <div class="text-xl font-semibold">
      Solde courant : 
      <span :class="balance >= 0 ? 'text-green-600' : 'text-red-600'">
        {{ balance.toFixed(2) }} €
      </span>
    </div>

    <!-- Graphique des dépenses -->
    <!-- <div class="max-w-xl">
      <PieChart :data="filteredExpensesByCategory" />
    </div> -->

    <!-- Transactions récentes -->
    <div>
      <h2 class="text-lg font-semibold mb-2">Transactions</h2>
      <ul class="divide-y">
        <li
          v-for="tx in filteredTransactions"
          :key="tx.id"
          class="py-2 flex justify-between"
        >
          <div>
            <p class="font-medium">{{ tx.description || tx.category }}</p>
            <p class="text-sm text-gray-500">
              {{ tx.date }} - {{ tx.category }}
            </p>
          </div>
          <div
            :class="tx.type === 'revenu' ? 'text-green-600' : 'text-red-600'"
          >
            {{ tx.type === 'revenu' ? '+' : '-' }}{{ tx.amount }} €
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
