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
  <div class="bg-white shadow rounded-xl p-4">
    <h2 class="text-lg font-semibold mb-4">Transactions</h2>

    <div v-if="transactions.length" class="space-y-4">
      <div
        v-for="tx in transactions"
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
            step="0.01"
            min="0"
            inputmodel="decimal"
            @change="e => onUpdateAmount(tx, e.target.value)"
            class="w-24 text-right border rounded p-1"
          />
          <span :class="tx.type === 'revenu' ? 'text-green-600' : 'text-red-600'">€</span>
        </div>
        <button
          @click="onDelete(tx.id)"
          class="text-red-600 hover:text-red-800 cursor-pointer"
        >
          Supprimer
        </button>
      </div>
    </div>

    <p v-else class="text-sm text-gray-500 text-center">
      Aucune transaction pour ce mois.
    </p>
  </div>
</template>
