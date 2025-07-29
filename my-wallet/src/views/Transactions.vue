<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  },
  onUpdateAmount: {
    type: Function,
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <div class="bg-white dark:bg-zinc-800 shadow rounded-2xl p-6">
    <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white text-center">Transactions</h2>

    <div v-if="transactions.length" class="space-y-4">
      <div
        v-for="tx in transactions"
        :key="tx.id"
        class="border-b border-gray-200 dark:border-zinc-600 pb-3"
        :class="tx.type === 'revenu' ? 'text-green-600' : 'text-red-600'"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div class="flex-1 space-y-1" >
            <div class="flex items-center gap-2">
              <h3 class="font-semibold dark:text-white">{{ tx.name }}</h3>
              <p class="text-sm italic">{{ tx.description || tx.category }}</p>
            </div>
            <p class="text-sm">
              {{ tx.date }} — {{ tx.category }} — {{ tx.type }}
            </p>
            <p class="text-xs italic" v-if="tx.recurrence">
              Récurrence : {{ tx.recurrence }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="number"
              :value="tx.amount"
              step="0.01"
              min="0"
              inputmode="decimal"
              @change="e => onUpdateAmount(tx, e.target.value)"
              class="w-24 text-right border rounded-md px-2 py-1 text-sm"
            />
            <span>€</span>
          </div>

          <button
            @click="onDelete(tx.id)"
            class="text-red-500 hover:text-red-700 text-sm"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-sm text-gray-500 text-center">
      Aucune transaction pour ce mois.
    </p>
  </div>
</template>

