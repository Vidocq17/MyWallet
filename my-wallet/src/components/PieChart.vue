<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { computed, toRefs } from 'vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartData = computed(() => {
  const categories = Object.keys(props.data || {})
  const values = Object.values(props.data || {})

  return {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#f87171',
          '#fbbf24',
          '#34d399',
          '#60a5fa',
          '#a78bfa',
          '#f472b6',
          '#facc15',
          '#4ade80'
        ]
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>
