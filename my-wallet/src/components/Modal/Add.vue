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
    <input v-model="newTx.category" type="text" placeholder="Catégorie" class="border p-2 rounded" />
    <input v-model="newTx.date" type="date" class="border p-2 rounded" />
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 sm:col-span-2">
      Ajouter
    </button>
  </form>
</div>
