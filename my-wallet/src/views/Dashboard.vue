<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/api'
import { exportCSV, exportExcel } from '../assets/utils/export'
import { useToast } from 'vue-toastification'

import Graph from './Graph.vue'
import Transactions from './Transactions.vue'
import Add from '@/components/Form.vue'

const transactions = ref([])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const toast = useToast()

const budgets = {
  alimentation: 300,
  abonnement: 100,
  logement: 1200,
  loisirs: 100,
  santé: 100,
  transport: 0,
  autres: 100,
}

const budgetAlerts = computed(() => {
  const map = {}
  filteredTransactions.value.forEach((tx) => {
    if (tx.type === 'dépense') {
      map[tx.category] = (map[tx.category] || 0) + tx.amount
    }
  })

  const alerts = []
  for (const [cat, max] of Object.entries(budgets)) {
    if ((map[cat] || 0) > max) {
      alerts.push({ category: cat, spent: map[cat], limit: max })
    }
  }
  return alerts
})

const autoGenerateRecurring = async () => {
  const now = new Date().toISOString().slice(0, 7)
  const all = await fetchTransactions()
  const rec = all.filter(
    (tx) =>
      tx.recurrence === 'mensuelle' &&
      !all.some((t) => t.name === tx.name && t.date.startsWith(now)),
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
  return transactions.value.filter((tx) => tx.date?.startsWith(selectedMonth.value))
})

const balance = computed(() => {
  return filteredTransactions.value.reduce((total, tx) => {
    return total + (tx.type === 'revenu' ? tx.amount : -tx.amount)
  }, 0)
})

const filteredExpensesByCategory = computed(() => {
  const map = {}
  filteredTransactions.value.forEach((tx) => {
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
    toast.add({
      severity: 'success',
      summary: 'Montant mis à jour',
      detail: `Le montant de la transaction "${tx.name}" a été mis à jour.`,
      life: 3000,
    })
  }
}

const handleDeleteTransaction = async (id) => {
  try {
    await deleteTransaction(id)
    await loadTransactions()
    toast.add({
      severity: 'success',
      summary: 'Transaction supprimée',
      detail: 'La transaction a été supprimée avec succès.',
      life: 3000,
    })
  } catch (error) {
    console.error('Erreur de suppression:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue lors de la suppression de la transaction.',
      life: 3000,
    })
  }
}

const handleExportCSV = () => exportCSV(filteredTransactions.value)
const handleExportExcel = () => exportExcel(filteredTransactions.value)
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-10">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
      💰 Tableau de bord financier
    </h1>

    <!-- Alertes de budget -->
    <div v-if="budgetAlerts.length" class="grid gap-3">
      <div
        v-for="alert in budgetAlerts"
        :key="alert.category"
        class="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between"
      >
        <span>
          ⚠️ <strong class="capitalize">{{ alert.category }}</strong> dépassé :
          {{ alert.spent }} € / {{ alert.limit }} €
        </span>
      </div>
    </div>

    <!-- Formulaire -->
    <Add @addTransaction="handleAddTransaction" />

    <!-- Filtres & exports -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <input
        type="month"
        v-model="selectedMonth"
        class="border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto shadow-sm"
      />

      <div class="flex gap-2">
        <button
          @click="handleExportCSV"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm"
        >
          Export CSV
        </button>
        <button
          @click="handleExportExcel"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm"
        >
          Export Excel
        </button>
      </div>
    </div>

    <!-- Solde -->
    <div
      class="bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 rounded-2xl p-6 shadow-sm text-center"
    >
      <h2 class="text-xl font-semibold text-gray-700 dark:text-white">Solde courant</h2>
      <p
        :class="balance >= 0 ? 'text-green-600' : 'text-red-600'"
        class="text-3xl font-bold mt-2"
      >
        {{ balance.toFixed(2) }} €
      </p>
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
