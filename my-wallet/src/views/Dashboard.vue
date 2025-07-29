<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchTransactions, addTransaction} from '../services/api'
import PieChart from '../components/PieChart.vue'
import { exportCSV, exportExcel } from '../assets/utils/export'

const selectedMonth = ref(new Date().toISOString().slice(0, 7))

onMounted(async () => {
  await api.fetchTransactions()
})

const filteredTransactions = computed(() => {
  if (!selectedMonth.value) return api.transactions
  return api.transactions.filter(tx => tx.date.startsWith(selectedMonth.value))
})

const balance = computed(() => {
  return filteredTransactions.value.reduce((total, tx) =>
    total + (tx.type === 'revenu' ? tx.amount : -tx.amount), 0)
}, 0)

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

const updateAmount = async (tx, newAmount) => {
  const parsed = parseFloat(newAmount)
  if (!isNaN(parsed) && parsed >= 0) {
    await store.updateTransactionAmount(tx.id, parsed)
    await store.fetchTransactions()
  }
}
</script>

<template>
  <div class="p-4 space-y-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center">Tableau de bord</h1>

    <!-- Filtres et actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <input
        type="month"
        v-model="selectedMonth"
        class="border rounded p-2 w-full sm:w-auto"
      />
      <div class="flex gap-2">
        <button
          @click="handleExportCSV"
          class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export CSV
        </button>
        <button
          @click="handleExportExcel"
          class="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export Excel
        </button>
      </div>
    </div>

    <!-- Solde -->
    <div class="bg-gray-100 rounded-xl p-4 text-xl font-semibold shadow-sm text-center">
      Solde courant :
      <span :class="balance >= 0 ? 'text-green-600' : 'text-red-600'">
        {{ balance.toFixed(2) }} €
      </span>
    </div>

    <!-- Graphique -->
    <div class="bg-white shadow rounded-xl p-4 max-w-2xl mx-auto">
      <h2 class="text-lg font-medium mb-2">Dépenses par catégorie</h2>
      <PieChart
        v-if="Object.keys(filteredExpensesByCategory).length"
        :data="filteredExpensesByCategory"
      />
      <p v-else class="text-sm text-gray-500 text-center">Aucune donnée disponible ce mois-ci.</p>
    </div>

    <!-- Transactions -->
    <div class="bg-white shadow rounded-xl p-4">
      <h2 class="text-lg font-semibold mb-4">Transactions</h2>
      <div v-if="filteredTransactions.length" class="space-y-4">
        <div
          v-for="tx in filteredTransactions"
          :key="tx.id"
          class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2"
        >
          <div class="flex-1">
            <p class="font-medium">{{ tx.description || tx.category }}</p>
            <p class="text-sm text-gray-500">
              {{ tx.date }} — {{ tx.category }} — {{ tx.type }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="number"
              :value="tx.amount"
              @change="e => updateAmount(tx, e.target.value)"
              class="w-24 text-right border rounded p-1"
            />
            <span :class="tx.type === 'revenu' ? 'text-green-600' : 'text-red-600'">
              €</span>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 text-center">Aucune transaction pour ce mois.</p>
    </div>
  </div>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button {
  opacity: 0.3;
}
</style>
