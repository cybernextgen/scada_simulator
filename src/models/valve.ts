import { useAppStore } from '@/stores/appStore'
import type { HistoryPoint } from './analog_sensor'
import { AlarmEvent, AlarmEventType } from './alarm_event'

export class Valve {
  public isOpened: boolean = false
  public isClosed: boolean = false
  public valueInternal: number = 0
  public history: HistoryPoint[] = []

  constructor(
    public name: string,
    public perfomance: number,
    value: number = 0,
    public LLM: number = 0,
    public HLM: number = 100,
  ) {
    this.value = value
  }

  set value(newValue: number) {
    if (newValue > this.HLM) newValue = this.HLM
    else if (newValue < this.LLM) newValue = this.LLM

    this.valueInternal = newValue

    this.history.push({
      timestamp: new Date(),
      value: newValue,
    })
    if (this.history.length > 240) this.history.shift()

    const deadZone = (this.HLM - this.LLM) * 0.05

    if (newValue <= this.LLM + deadZone) {
      if (!this.isClosed)
        useAppStore().events.push(
          new AlarmEvent(AlarmEventType.PROCESS, this.name, `Клапан закрыт`, new Date()),
        )

      this.isClosed = true
      this.isOpened = false
    } else if (newValue >= this.HLM - deadZone) {
      if (!this.isOpened)
        useAppStore().events.push(
          new AlarmEvent(AlarmEventType.PROCESS, this.name, `Клапан открыт`, new Date()),
        )
      this.isOpened = true
      this.isClosed = false
    } else {
      this.isClosed = false
      this.isOpened = false
    }
  }

  get value() {
    return this.valueInternal
  }

  get currentPerfomance() {
    return (this.perfomance * this.valueInternal) / (this.HLM - this.LLM)
  }
}
