<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/api'
import { exportCSV, exportExcel } from '../assets/utils/export'

import Graph from './Graph.vue'
import Transactions from './Transactions.vue'

const transactions = ref([])
const selectedMonth = ref(new Date().toISOString().slice(0, 7))

const loadTransactions = async () => {
  try {
    transactions.value = await fetchTransactions()
  } catch (error) {
    console.error('Erreur fetch:', error)
  }
}

onMounted(loadTransactions)

const categories = ref([
  'Alimentation',
  'Abonnement',
  'Logement',
  'Loisirs',
  'Santé',
  'Transport',
  'Autres'
])

const newTx = ref({
  description: '',
  amount: '',
  type: '',
  category: '',
  date: new Date().toISOString().slice(0, 10)
})

const handleAddTransaction = async () => {
  const tx = {
    ...newTx.value,
    amount: parseFloat(newTx.value.amount)
  }

  if (!tx.description || isNaN(tx.amount) || !tx.type || !tx.category || !tx.date) {
    alert('Tous les champs sont obligatoires')
    return
  }

  try {
    await addTransaction(tx)
    await loadTransactions()

    // Reset form
    newTx.value = {
      description: '',
      amount: '',
      type: '',
      category: '',
      date: new Date().toISOString().slice(0, 10)
    }
  } catch (err) {
    console.error('Erreur ajout:', err)
    alert('Erreur lors de l’ajout')
  }
}

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
  }
}

const handleDeleteTransaction = async (id) => {
  try {
    await deleteTransaction(id)
    await loadTransactions()
  } catch (error) {
    console.error('Erreur de suppression:', error)
  }
}

const handleExportCSV = () => exportCSV(filteredTransactions.value)
const handleExportExcel = () => exportExcel(filteredTransactions.value)
</script>

<template>
  <div class="p-4 space-y-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center">Tableau de bord</h1>

    <!-- Formulaire -->
    <div class="bg-white shadow rounded-xl p-4 space-y-4">
      <h2 class="text-lg font-semibold">Ajouter une transaction</h2>
      <form @submit.prevent="handleAddTransaction" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input v-model="newTx.description" type="text" placeholder="Description" class="border p-2 rounded" />
        <input v-model="newTx.amount" type="number" placeholder="Montant (€)" class="border p-2 rounded" />
        <select v-model="newTx.type" class="border p-2 rounded">
          <option disabled value="">Type</option>
          <option value="revenu">Revenu</option>
          <option value="dépense">Dépense</option>
        </select>
        <select v-model="newTx.category" class="border p-2 rounded">
          <option disabled value="">Choisir une catégorie</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <input v-model="newTx.date" type="date" class="border p-2 rounded" />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 sm:col-span-2">
          Ajouter
        </button>
      </form>
    </div>

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
