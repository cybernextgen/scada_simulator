import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AlarmEvent } from '@/models/alarm_event'

export const useAppStore = defineStore('appStore', () => {
  const events = ref<AlarmEvent[]>([])

  return { events }
})
