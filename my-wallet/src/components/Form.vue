<script setup>
import { ref } from 'vue'
import { fetchTransactions, addTransaction } from '../services/api'
const categories = ref([
  'Alimentation',
  'Abonnement',
  'Logement',
  'Loisirs',
  'Santé',
  'Transport',
  'Autres',
])

const transactions = ref([])

const newTx = ref({
  name: '',
  description: '',
  amount: '',
  type: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  recurrence: '',
})

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
    category: newTx.value.category === 'Autres' ? newTx.value.customCategory : newTx.value.category,
  }

  if (!tx.name || !tx.description || isNaN(tx.amount) || !tx.type || !tx.category || !tx.date) {
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
      date: new Date().toISOString().slice(0, 10),
    }
  } catch (err) {
    console.error('Erreur ajout:', err)
    alert('Erreur lors de l’ajout')
  }
}
</script>

<template>
  <div class="bg-white shadow rounded-xl p-4 space-y-4">
        <h2 class="text-lg font-semibold">Ajouter une transaction</h2>
        <form @submit.prevent="handleAddTransaction" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <input
            v-model="newTx.name"
            type="text"
            placeholder="Nom"
            class="border p-2 rounded"
          />

          <input
            v-model="newTx.description"
            type="text"
            placeholder="Description"
            class="border p-2 rounded"
          />
          
          <input
            v-model="newTx.amount"
            type="number"
            placeholder="Montant (€)"
            class="border p-2 rounded"
          />
          
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
            <option value="Autres">Autres</option>
          </select>

          <input
            v-if="newTx.category === 'Autres'"
            v-model="newTx.customCategory"
            type="text"
            placeholder="Nouvelle catégorie"
            class="border p-2 rounded"
          />

          <select v-if="newTx.category === 'Abonnement'" v-model="newTx.recurrence" placeholder="Récurrence" class="border p-2 rounded">
            <option value="">Ponctuelle</option>
            <option value="mensuelle">Mensuelle</option>
            <option value="hebdomadaire">Hebdomadaire</option>
            <option value="annuelle">Annuelle</option>
          </select>

          <input v-model="newTx.date" type="date" class="border p-2 rounded" />

          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 sm:col-span-2"
          >
            Ajouter
          </button>
        </form>
      </div>
</template>
