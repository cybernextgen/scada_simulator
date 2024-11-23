<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useAppStore } from '@/stores/appStore'
import { AlarmEvent, AlarmEventLevel, AlarmEventType } from '@/models/alarm_event'
import { ColorScheme } from '@/models/color_scheme'

const currentDateTime = ref<string>()
const activeAlarm = ref<AlarmEvent>()
const appStore = useAppStore()

watch(
  () => appStore.events,
  () => {
    console.log(appStore.events)
    const activeAlarms = appStore.events
      .filter(
        (e) =>
          !e.ackTimestamp && e.eventType == AlarmEventType.PROCESS && e.eventLevel != undefined,
      )
      .reverse()
    if (activeAlarms.length > 0) activeAlarm.value = activeAlarms[0]
  },
  { deep: true },
)

function formatTimestamp(d: Date): string {
  return dayjs(d).format('mm:ss')
}

function getBackgroundColorForActiveAlarm() {
  if (!activeAlarm.value) return 'rgba(0, 0, 0, 0)'

  const eventLevel = activeAlarm.value.eventLevel
  if (eventLevel == undefined) return 'rgba(0, 0, 0, 0)'

  return {
    [AlarmEventLevel.AH]: ColorScheme.ALARM_COLOR,
    [AlarmEventLevel.AL]: ColorScheme.ALARM_COLOR,
    [AlarmEventLevel.WH]: ColorScheme.WARNING_COLOR,
    [AlarmEventLevel.WL]: ColorScheme.WARNING_COLOR,
  }[eventLevel]
}

onMounted(() => {
  setInterval(() => {
    currentDateTime.value = formatTimestamp(new Date())
  }, 1000)
})

function ack() {
  if (!activeAlarm.value) return
  activeAlarm.value.ackTimestamp = new Date()
  activeAlarm.value = undefined
}
</script>
<template>
  <div class="active_alarm container">
    <div class="row">
      <div class="active_alarm__clock col-1">{{ currentDateTime }}</div>
      <div
        class="active_alarm__alarm col clickable"
        :style="{ 'background-color': getBackgroundColorForActiveAlarm() }"
        @click="ack"
      >
        <span v-if="activeAlarm">
          {{ formatTimestamp(activeAlarm.eventTimestamp) }}: {{ activeAlarm.position }} -
          {{ activeAlarm.description }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.active_alarm {
  height: 50px;
  margin-bottom: 15px;
}

.active_alarm__clock {
  font-size: 30px;
}

.active_alarm__alarm {
  font-size: 30px;
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.container {
  width: 100%;
}
</style>
