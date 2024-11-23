<script lang="ts" setup>
import type { PIDRegulator } from '@/models/PID_regulator'
import { computed, ref } from 'vue'
import AlarmEventsTable from './AlarmEventsTable.vue'

const regulator = ref<PIDRegulator>()
const currentPage = ref<'control' | 'settings' | 'chart' | 'events'>('control')
const dialog = ref<HTMLDialogElement>()

const sp = ref<number>(0)
const lmn = ref<number>(0)
const p = ref<number>(1)
const i = ref<number>(0)
const d = ref<number>(0)

const isEnabled = ref<boolean>(false)

function init() {
  if (!regulator.value) return
  sp.value = regulator.value.SP
  lmn.value = regulator.value.LMN
  p.value = regulator.value.P
  i.value = regulator.value.I
  d.value = regulator.value.D
  isEnabled.value = regulator.value.isEnabled
}

function open(r: PIDRegulator) {
  if (!dialog.value) return
  currentPage.value = 'control'
  regulator.value = r
  init()

  // if (chartInstance) chartInstance.destroy()
  // // @ts-expect-error looks like chart data missing some required attrs, but working fine anyway
  // chartInstance = new Chart(chartCanvas.value, {
  //   type: 'line',
  //   data: chartData.value,
  //   options: {
  //     plugins: {
  //       legend: {
  //         display: false,
  //       },
  //     },
  //     animation: {
  //       duration: 0,
  //     },
  //     scales: {
  //       y: { min: valve.value.LLM, max: valve.value.HLM },
  //     },
  //   },
  // })

  dialog.value.showModal()
}

function close() {
  if (!dialog.value) return
  dialog.value.close()
}

function ok() {
  if (!regulator.value) return

  regulator.value.isEnabled = isEnabled.value
  regulator.value.P = p.value
  regulator.value.I = i.value
  regulator.value.D = d.value

  if (isEnabled.value) {
    regulator.value.SP = sp.value
  } else {
    regulator.value.LMN = lmn.value
  }
}

defineExpose({ open })
</script>
<template>
  <dialog ref="dialog" class="card">
    <header>
      <h2>{{ regulator?.name }}</h2>
    </header>

    <nav class="tabs">
      <a
        :class="{ active: currentPage == 'control' }"
        @click="currentPage = 'control'"
        class="clickable"
        >Управление</a
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
      <div v-show="currentPage == 'control'">
        <form @submit.prevent="ok">
          <div class="row">
            <div class="col text-center">
              <button
                type="button"
                class="button"
                :class="{ primary: isEnabled, outline: !isEnabled }"
                @click="isEnabled = true"
              >
                Автомат
              </button>
            </div>
            <div class="col text-center">
              <button
                type="button"
                class="button"
                :class="{ primary: !isEnabled, outline: isEnabled }"
                @click="isEnabled = false"
              >
                Ручной
              </button>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <p>
                <label for="SP">Уставка, {{ regulator?.unitsOfMeasurement }}</label>
                <input
                  v-if="isEnabled"
                  type="number"
                  :min="regulator?.InputLLM"
                  :max="regulator?.InputHLM"
                  v-model="sp"
                  id="SP"
                />
                <input
                  v-if="!isEnabled"
                  disabled="true"
                  :value="regulator?.SP.toFixed(1)"
                  id="SP"
                />
              </p>
            </div>
            <div class="col">
              <label for="LMN">Управляющее воздействие, %</label>
              <input
                v-if="!isEnabled"
                type="number"
                :min="regulator?.OutputLLM"
                :max="regulator?.OutputHLM"
                v-model="lmn"
                id="LMN"
              />
              <input
                v-if="isEnabled"
                disabled="true"
                type="number"
                id="LMN"
                :value="regulator?.LMN.toFixed(1)"
              />
            </div>
          </div>
        </form>
      </div>
      <div v-show="currentPage == 'settings'">
        <form @submit.prevent="ok">
          <div class="row">
            <div class="col">
              <p>
                <label>Коэффициент P:</label>
                <input type="number" min="0" max="10" v-model="p" />
              </p>
            </div>
            <div class="col">
              <p>
                <label>Коэффициент I:</label>
                <input type="number" min="0" max="10" v-model="i" />
              </p>
            </div>
            <div class="col">
              <p>
                <label>Коэффициент D:</label>
                <input type="number" min="0" max="2" v-model="d" />
              </p>
            </div>
          </div>
        </form>
      </div>
      <div v-show="currentPage == 'chart'">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div v-show="currentPage == 'events'" class="dialog__body__events">
        <AlarmEventsTable :position="regulator?.name" :limit="10"></AlarmEventsTable>
      </div>
    </div>
    <footer>
      <div class="row">
        <div class="col is-left">
          <button
            class="button primary"
            @click="ok"
            v-show="currentPage == 'control' || currentPage == 'settings'"
          >
            Применить
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
  min-height: 150px;
  padding-bottom: 15px;
}
.dialog__body {
  text-align: left;
}

form {
  margin-top: 15px;
}

.dialog__body__events {
  height: 370px;
  overflow-y: auto;
}
</style>
