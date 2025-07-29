<script setup>
import { defineProps } from 'vue'
import PieChart from '../components/PieChart.vue'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white dark:bg-zinc-800 shadow rounded-2xl p-6 max-w-3xl mx-auto">
    <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Dépenses par catégorie</h2>
    <PieChart
      v-if="Object.keys(data).length"
      :data="data"
    />
    <p v-else class="text-sm text-gray-500 text-center">Aucune donnée disponible.</p>
  </div>
</template>

