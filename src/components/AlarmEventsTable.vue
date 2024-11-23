<script lang="ts" setup>
import { useAppStore } from '@/stores/appStore'
import { computed } from 'vue'
import { AlarmEvent, AlarmEventType, AlarmEventLevel } from '@/models/alarm_event'
import { ColorScheme } from '@/models/color_scheme'
import dayjs from 'dayjs'

const props = defineProps<{ position?: string; limit?: number }>()

const appStore = useAppStore()

const filteredEvents = computed(() => {
  let alarmEvents: AlarmEvent[]
  if (props.position) {
    alarmEvents = appStore.events.filter((e) => e.position === props.position)
  } else {
    alarmEvents = [...appStore.events]
  }

  alarmEvents = alarmEvents.reverse()

  if (props.limit) {
    alarmEvents = alarmEvents.splice(0, props.limit)
  }
  return alarmEvents
})

function formatDate(d?: Date): string {
  if (!d) return ''
  return dayjs(d).format('mm:ss')
}

function formatType(t: AlarmEventType) {
  return {
    [AlarmEventType.PROCESS]: 'Процесс',
    [AlarmEventType.SYSTEM]: 'АСУТП',
    [AlarmEventType.USER]: 'Пользователь',
  }[t]
}

function getBackgroundColor(e: AlarmEvent) {
  const eventType = e.eventType
  const eventLevel = e.eventLevel

  if (eventType === AlarmEventType.PROCESS && eventLevel != undefined) {
    if (eventLevel == AlarmEventLevel.AH || eventLevel == AlarmEventLevel.AL) {
      return ColorScheme.ALARM_COLOR
    } else if (eventLevel == AlarmEventLevel.WH || eventLevel == AlarmEventLevel.WL) {
      return ColorScheme.WARNING_COLOR
    }
  } else if (eventType == AlarmEventType.SYSTEM) {
    return ColorScheme.SYSTEM_ALARM_EVENT_TYPE
  } else if (eventType == AlarmEventType.USER) {
    return ColorScheme.USER_ALARM_EVENT_TYPE
  }
}
</script>
<template>
  <table>
    <thead>
      <tr>
        <th>Дата</th>
        <th>Источник</th>
        <th>Описание</th>
        <th>Квитировано</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in filteredEvents"
        :key="item.eventTimestamp.getTime + item.position"
        :style="{ 'background-color': getBackgroundColor(item) }"
      >
        <td>{{ formatDate(item.eventTimestamp) }}</td>
        <td>{{ formatType(item.eventType) }}</td>
        <td>{{ item.description }}</td>
        <td>{{ formatDate(item.ackTimestamp) }}</td>
      </tr>
      <tr v-if="!filteredEvents.length">
        <td colspan="4" class="text-light">События отсутствуют</td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped></style>
