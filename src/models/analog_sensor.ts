import { useAppStore } from '@/stores/counter'
import { AlarmEvent, AlarmEventType } from './alarm_event'

export type HistoryPoint = { timestamp: Date; value: number }

export class AnalogSensor {
  public isALActive = false
  public isWLActive = false
  public isWHActive = false
  public isAHActive = false
  public history: HistoryPoint[] = []

  private valueInternal: number = 0

  constructor(
    public name: string,
    public unitsOfMeasurement: string,
    public LLM: number = 0,
    public HLM: number = 100,
    public AL?: number,
    public WL?: number,
    public WH?: number,
    public AH?: number,
    public alarm_hyst: number = 1,
  ) {}

  set value(newValue: number) {
    this.valueInternal = newValue

    // const currentTimestamp = new Date().getTime()
    this.history.push({
      timestamp: new Date(),
      value: newValue,
    })
    if (this.history.length > 60) this.history.shift()

    if (this.AL) {
      this.isALActive = this.checkLimit(this.AL, this.isALActive, true, true)
    }
    if (this.AH) {
      this.isAHActive = this.checkLimit(this.AH, this.isAHActive, false, true)
    }
    if (this.WL) {
      this.isWLActive = this.isWLActive || this.isALActive
      this.isWLActive = this.checkLimit(this.WL, this.isWLActive)
    }
    if (this.WH) {
      this.isWHActive = this.isWHActive || this.isAHActive
      this.isWHActive = this.checkLimit(this.WH, this.isWHActive, false)
    }
  }

  private checkLimit(
    limit: number,
    isLimitActive: boolean,
    isLowLimit = true,
    isAlarm = false,
  ): boolean {
    let limitName = isLowLimit ? 'нижней' : 'верхней'
    limitName = limitName + ' ' + (isAlarm ? 'аварийной' : 'предупредительной')

    if (!isLimitActive) {
      if (isLowLimit && this.valueInternal < limit) {
        useAppStore().events.push(
          new AlarmEvent(
            AlarmEventType.PROCESS,
            this.name,
            `Нарушение ${limitName} границы`,
            new Date(),
          ),
        )
        return true
      }

      if (!isLowLimit && this.valueInternal > limit) {
        useAppStore().events.push(
          new AlarmEvent(
            AlarmEventType.PROCESS,
            this.name,
            `Нарушение ${limitName} границы`,
            new Date(),
          ),
        )
        return true
      }
    }

    if (isLimitActive) {
      const deadZone = (this.HLM - this.LLM) * 0.01 * this.alarm_hyst
      if (isLowLimit && this.valueInternal < limit + deadZone) {
        return true
      }

      if (!isLowLimit && this.valueInternal > limit - deadZone) {
        return true
      }
    }

    return false
  }

  get value() {
    return this.valueInternal
  }
}
