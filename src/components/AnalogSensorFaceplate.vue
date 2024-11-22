<script lang="ts" setup>
import { AnalogSensor } from '@/models/analog_sensor'
import { computed, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'

const dialog = ref<HTMLDialogElement>()
const chartCanvas = ref<HTMLCanvasElement>()

const sensor = ref<AnalogSensor>()
const currentPage = ref<'chart' | 'settings'>('chart')

let chartInstance: Chart | undefined = undefined

const chartData = computed(() => {
  const labels = sensor.value?.history.map((point) => {
    return dayjs(point.timestamp).format('mm:ss')
  })
  const data = sensor.value?.history.map((point) => {
    return point.value
  })
  return {
    labels,
    datasets: [
      {
        data: data,
        fill: false,
        borderColor: 'var(--color-darkGrey)',
        tension: 0.1,
        pointRadius: 2,
      },
    ],
  }
})

watch(
  () => chartData.value,
  (newData) => {
    if (!chartInstance) return
    console.log(chartData.value)
    chartInstance.data = newData
    chartInstance.update()
  },
)

function open(s: AnalogSensor) {
  console.log(chartCanvas.value)
  if (!dialog.value || !chartCanvas.value || !chartData.value) return
  sensor.value = s

  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: chartData.value,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      animation: {
        duration: 0,
      },
      scales: {
        y: { min: sensor.value.LLM, max: sensor.value.HLM },
      },
    },
  })

  dialog.value.showModal()
}

function close() {
  if (!dialog.value) return

  currentPage.value = 'chart'
  dialog.value.close()
}

onMounted(() => {})

defineExpose({ open })
</script>
<template>
  <dialog ref="dialog" class="card">
    <header>
      <h2>{{ sensor?.name }}: {{ sensor?.value.toFixed(1) }} {{ sensor?.unitsOfMeasurement }}</h2>
    </header>

    <nav class="tabs">
      <a
        :class="{ active: currentPage == 'chart' }"
        @click="currentPage = 'chart'"
        class="clickable"
        >Диаграмма</a
      >
      <a
        :class="{ active: currentPage == 'settings' }"
        @click="currentPage = 'settings'"
        class="clickable"
        >Настройки</a
      >
    </nav>
    <div class="dialog__body">
      <div v-show="currentPage == 'chart'">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div v-show="currentPage == 'settings'">
        <p>Параметры</p>
      </div>
    </div>

    <footer class="is-right">
      <button class="button" @click="close">Закрыть</button>
    </footer>
  </dialog>
</template>
<style scoped>
dialog {
  border: none;
  width: 500px;
}

header {
  text-align: left;
}

.dialog__body {
  min-height: 250px;
}
</style>
