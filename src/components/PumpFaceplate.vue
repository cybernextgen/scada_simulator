<script lang="ts" setup>
import type { Pump } from '@/models/pump'
import { ref } from 'vue'
import AlarmEventsTable from './AlarmEventsTable.vue'

const pump = ref<Pump>()
const currentPage = ref<'control' | 'events'>('control')
const dialog = ref<HTMLDialogElement>()

function open(p: Pump) {
  if (!dialog.value) return
  currentPage.value = 'control'
  pump.value = p
  dialog.value.showModal()
}

function close() {
  if (!dialog.value) return
  dialog.value.close()
}

function enable() {
  pump.value?.enable()
}

function disable() {
  pump.value?.disable()
}

defineExpose({ open })
</script>
<template>
  <dialog ref="dialog" class="card">
    <header>
      <h2>{{ pump?.name }}</h2>
    </header>

    <nav class="tabs">
      <a
        :class="{ active: currentPage == 'control' }"
        @click="currentPage = 'control'"
        class="clickable"
        >Управление</a
      >
      <a
        :class="{ active: currentPage == 'events' }"
        @click="currentPage = 'events'"
        class="clickable"
        >События</a
      >
    </nav>
    <div class="dialog__body">
      <div v-show="currentPage == 'control'" class="dialog__body__control">
        <button
          class="button primary"
          :disabled="pump?.isEnabled"
          @click="enable"
          v-if="!pump?.isBlocked"
        >
          Включить
        </button>
        <button
          class="button secondary"
          :disabled="!pump?.isEnabled"
          @click="disable"
          v-if="!pump?.isBlocked"
        >
          Выключить
        </button>
        <h4 class="text-danger" v-if="pump?.isBlocked">Работа насоса заблокирована</h4>
      </div>

      <div v-show="currentPage == 'events'" class="dialog__body__events">
        <AlarmEventsTable :position="pump?.name" :limit="10"></AlarmEventsTable>
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
  min-height: 150px;
  margin-top: 20px;
  padding-bottom: 15px;
}
.dialog__body__control {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog__body__events {
  height: 370px;
  overflow-y: auto;
}
</style>
