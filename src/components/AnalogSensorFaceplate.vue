<script lang="ts" setup>
import { AnalogSensor } from '@/models/analog_sensor'
import { computed, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import dayjs from 'dayjs'
import AlarmEventsTable from './AlarmEventsTable.vue'

const dialog = ref<HTMLDialogElement>()
const chartCanvas = ref<HTMLCanvasElement>()

const sensor = ref<AnalogSensor>()
const currentPage = ref<'chart' | 'settings' | 'events'>('chart')

let chartInstance: Chart | undefined = undefined

const llm = ref<number>(0)
const hlm = ref<number>(100)
const al = ref<number>()
const wl = ref<number>()
const wh = ref<number>()
const ah = ref<number>()

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

function open(s: AnalogSensor) {
  if (!dialog.value || !chartCanvas.value || !chartData.value) return
  sensor.value = s

  hlm.value = sensor.value.HLM
  llm.value = sensor.value.LLM
  al.value = sensor.value.AL
  wl.value = sensor.value.WL
  wh.value = sensor.value.WH
  ah.value = sensor.value.AH

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

function save() {
  if (!dialog.value || !sensor.value) return

  sensor.value.HLM = hlm.value
  sensor.value.LLM = llm.value
  sensor.value.AL = al.value
  sensor.value.WL = wl.value
  sensor.value.WH = wh.value
  sensor.value.AH = ah.value
}

onMounted(() => {})

defineExpose({ open })
</script>
<template>
  <dialog ref="dialog" class="card">
    <header>
      <h2>{{ sensor?.name }}: {{ sensor?.value.toFixed(1) }}{{ sensor?.unitsOfMeasurement }}</h2>
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
      <div v-show="currentPage == 'settings'">
        <form @submit.prevent="save">
          <div class="row">
            <div class="col">
              <h4>Шкала прибора, {{ sensor?.unitsOfMeasurement }}</h4>
              <p>
                <label for="hlm">Верхнее значение:</label>
                <input type="number" id="HLM" v-model="hlm" required />
              </p>
              <p>
                <label for="llm">Нижнее значение:</label>
                <input type="number" id="LLM" v-model="llm" required />
              </p>
            </div>
            <div class="col">
              <h4>Уставки сигнализации, {{ sensor?.unitsOfMeasurement }}</h4>
              <p>
                <label for="ah">Верхнее предаварийн. значение:</label>
                <input type="number" id="ah" v-model="ah" />
              </p>
              <p>
                <label for="wh">Верхнее предупредит. значение:</label>
                <input type="number" id="wh" v-model="wh" />
              </p>
              <p>
                <label for="wl">Нижнее предупредит. значение:</label>
                <input type="number" id="wl" v-model="wl" />
              </p>
              <p>
                <label for="al">Нижнее предаварийн. значение:</label>
                <input type="number" id="al" v-model="al" />
              </p>
            </div>
          </div>
        </form>
      </div>
      <div v-show="currentPage == 'events'" class="dialog__body__events">
        <AlarmEventsTable :position="sensor?.name" :limit="10"></AlarmEventsTable>
      </div>
    </div>

    <footer>
      <div class="row">
        <div class="col is-left">
          <button class="button primary" @click="save" v-show="currentPage == 'settings'">
            Сохранить
          </button>
        </div>
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
