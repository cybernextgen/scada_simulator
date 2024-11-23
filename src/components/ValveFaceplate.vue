<script lang="ts" setup>
import { Valve } from '@/models/valve'
import { computed, ref, watch } from 'vue'
import AlarmEventsTable from './AlarmEventsTable.vue'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'

const valve = ref<Valve>()
const currentPage = ref<'chart' | 'events'>('chart')
const dialog = ref<HTMLDialogElement>()

const chartCanvas = ref<HTMLCanvasElement>()
let chartInstance: Chart | undefined = undefined

const chartData = computed(() => {
  const labels = valve.value?.history.map((point) => {
    return dayjs(point.timestamp).format('mm:ss')
  })
  const data = valve.value?.history.map((point) => {
    return point.value
  })
  return {
    labels,
    datasets: [
      {
        data: data,
        fill: false,
        borderColor: 'black',
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

    // @ts-expect-error looks like chart data missing some required attrs, but working fine anyway
    chartInstance.data = newData
    chartInstance.update()
  },
)

function open(v: Valve) {
  if (!dialog.value || !chartCanvas.value || !chartData.value) return
  currentPage.value = 'chart'
  valve.value = v

  if (chartInstance) chartInstance.destroy()
  // @ts-expect-error looks like chart data missing some required attrs, but working fine anyway
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
        y: { min: valve.value.LLM, max: valve.value.HLM },
      },
    },
  })

  dialog.value.showModal()
}

function close() {
  if (!dialog.value) return
  dialog.value.close()
}

defineExpose({ open })
</script>
<template>
  <dialog ref="dialog" class="card">
    <header>
      <h2>{{ valve?.name }}: {{ valve?.value.toFixed(1) }}%</h2>
    </header>

    <nav class="tabs">
      <a
        :class="{ active: currentPage == 'chart' }"
        @click="currentPage = 'chart'"
        class="clickable"
        >Диаграмма</a
      >
      <a
        :class="{ active: currentPage == 'events' }"
        @click="currentPage = 'events'"
        class="clickable"
        >События</a
      >
    </nav>
    <div class="dialog__body">
      <div v-show="currentPage == 'chart'">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div v-show="currentPage == 'events'" class="dialog__body__events">
        <AlarmEventsTable :position="valve?.name" :limit="10"></AlarmEventsTable>
      </div>
    </div>
    <footer>
      <div class="row">
        <div class="col is-right">
          <button class="button" @click="close">Закрыть</button>
        </div>
      </div>
    </footer>
  </dialog>
</template>
<style scoped>
dialog {
  border: none;
  width: 600px;
}
header {
  text-align: left;
}
.dialog__body {
  min-height: 370px;
  padding-bottom: 15px;
}
.dialog__body {
  text-align: left;
}

.dialog__body__events {
  height: 370px;
  overflow-y: auto;
}
</style>
