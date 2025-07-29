<script setup>
import { ref, watch } from 'vue'
import { fetchTransactions, addTransaction } from '../services/api'

const categories = ref([
  'Alimentation',
  'Abonnement',
  'Logement',
  'Loisirs',
  'Santé',
  'Transport',
  'Autres'
])

const transactions = ref([])

const newTx = ref({
  name: '',
  description: '',
  amount: '',
  type: '',
  category: '',
  customCategory: '',
  recurrence: '',
  date: new Date().toISOString().slice(0, 10)
})

const emit = defineEmits(['addTransaction'])

const loadTransactions = async () => {
  try {
    transactions.value = await fetchTransactions()
  } catch (error) {
    console.error('Erreur fetch:', error)
  }
}

const handleAddTransaction = async () => {
  const tx = {
    ...newTx.value,
    category: newTx.value.category === 'Autres'
      ? newTx.value.customCategory
      : newTx.value.category
  }

  if (!tx.name || !tx.description || isNaN(tx.amount) || !tx.type || !tx.category || !tx.date) {
    alert('Tous les champs sont obligatoires')
    return
  }

  try {
    await addTransaction(tx)
    emit('addTransaction', tx)
    await loadTransactions()

    // Reset form
    newTx.value = {
      name: '',
      description: '',
      amount: '',
      type: '',
      category: '',
      customCategory: '',
      recurrence: '',
      date: new Date().toISOString().slice(0, 10)
    }
  } catch (err) {
    console.error('Erreur ajout:', err)
    alert('Erreur lors de l’ajout')
  }
}
</script>

<template>
  <div class="bg-white dark:bg-zinc-800 shadow rounded-2xl p-6">
    <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Ajouter une transaction</h2>

    <form @submit.prevent="handleAddTransaction" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        v-model="newTx.name"
        type="text"
        placeholder="Nom"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      />

      <input
        v-model="newTx.description"
        type="text"
        placeholder="Description"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      />

      <input
        v-model="newTx.amount"
        type="number"
        step="0.01"
        min="0"
        inputmode="decimal"
        placeholder="Montant (€)"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      />

      <select
        v-model="newTx.type"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      >
        <option disabled value="">Type</option>
        <option value="revenu">Revenu</option>
        <option value="dépense">Dépense</option>
      </select>

      <select
        v-model="newTx.category"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      >
        <option disabled value="">Catégorie</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        <option value="Autres">Autres</option>
      </select>

      <input
        v-if="newTx.category === 'Autres'"
        v-model="newTx.customCategory"
        type="text"
        placeholder="Nouvelle catégorie"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      />

      <select
        v-if="newTx.category === 'Abonnement'"
        v-model="newTx.recurrence"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      >
        <option value="">Ponctuelle</option>
        <option value="mensuelle">Mensuelle</option>
        <option value="hebdomadaire">Hebdomadaire</option>
        <option value="annuelle">Annuelle</option>
      </select>

      <input
        v-model="newTx.date"
        type="date"
        class="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm p-2 rounded-lg shadow-sm"
      />

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm sm:col-span-2 text-sm"
      >
        ➕ Ajouter la transaction
      </button>
    </form>
  </div>
</template>
