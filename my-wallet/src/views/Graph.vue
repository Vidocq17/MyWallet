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
  <div class="bg-white shadow rounded-xl p-4 max-w-2xl mx-auto">
    <h2 class="text-lg font-medium mb-2">Dépenses par catégorie</h2>
    <PieChart
      v-if="Object.keys(data).length"
      :data="data"
    />
    <p v-else class="text-sm text-gray-500 text-center">Aucune donnée disponible.</p>
  </div>
</template>

