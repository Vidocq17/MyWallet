<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/api'
import { exportCSV, exportExcel } from '../assets/utils/export'
import { useToast } from 'vue-toastification'

import Graph from './Graph.vue'
import Transactions from './Transactions.vue'
import Add from '@/components/Modal/Add.vue'

const transactions = ref([])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const toast = useToast()

const autoGenerateRecurring = async () => {
  const now = new Date().toISOString().slice(0, 7)
  const all = await fetchTransactions()
  const rec = all.filter(tx =>
    tx.recurrence === 'mensuelle' &&
    !all.some(t =>
      t.description === tx.description &&
      t.date.startsWith(now)
    )
  )
  for (const tx of rec) {
    const copy = { ...tx, date: new Date().toISOString().slice(0, 10) }
    delete copy.id
    await addTransaction(copy)
  }
}


const loadTransactions = async () => {
  try {
    transactions.value = await fetchTransactions()
  } catch (error) {
    console.error('Erreur fetch:', error)
  }
}

onMounted(loadTransactions)

const filteredTransactions = computed(() => {
  return transactions.value.filter(tx =>
    tx.date?.startsWith(selectedMonth.value)
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

const updateAmount = async (tx, newAmount) => {
  const parsed = parseFloat(newAmount)
  if (!isNaN(parsed) && parsed >= 0) {
    await updateTransaction(tx.id, { amount: parsed })
    await loadTransactions()
    toast.add({ severity: 'success', summary: 'Montant mis à jour', detail: `Le montant de la transaction "${tx.description}" a été mis à jour.`, life: 3000 })
  }
}

const handleDeleteTransaction = async (id) => {
  try {
    await deleteTransaction(id)
    await loadTransactions()
    toast.add({ severity: 'success', summary: 'Transaction supprimée', detail: 'La transaction a été supprimée avec succès.', life: 3000 })
  } catch (error) {
    console.error('Erreur de suppression:', error)
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la suppression de la transaction.', life: 3000 })
  }
}

const handleExportCSV = () => exportCSV(filteredTransactions.value)
const handleExportExcel = () => exportExcel(filteredTransactions.value)
</script>

<template>
  <div class="p-4 space-y-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center">Tableau de bord</h1>

    <!-- Formulaire -->
    <Add @addTransaction="handleAddTransaction" />

    <!-- Filtres -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <input
        type="month"
        v-model="selectedMonth"
        class="border rounded p-2 w-full sm:w-auto"
      />
      <div class="flex gap-2">
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
    </div>

    <!-- Solde -->
    <div class="bg-gray-100 rounded-xl p-4 text-xl font-semibold shadow-sm text-center">
      Solde courant :
      <span :class="balance >= 0 ? 'text-green-600' : 'text-red-600'">
        {{ balance.toFixed(2) }} €
      </span>
    </div>

    <!-- Graphique -->
    <Graph :data="filteredExpensesByCategory" />

    <!-- Transactions -->
    <Transactions
      :transactions="filteredTransactions"
      :onUpdateAmount="updateAmount"
      :on-delete="handleDeleteTransaction"
    />
  </div>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button {
  opacity: 0.3;
}
</style>
