import { useAppStore } from '@/stores/appStore'
import { AlarmEvent, AlarmEventLevel, AlarmEventType } from './alarm_event'

export class Pump {
  private startingIntervalId?: number = undefined
  private enableTimestamp?: Date = undefined
  public isStartingFlash: boolean = false
  public isEnabled: boolean = false
  public isStarting: boolean = false
  public isBlockedInernal: boolean = false

  constructor(
    public name: string,
    public performance: number,
    public startTimeSeconds = 10,
    public inertia = 0.2,
  ) {}

  enable() {
    useAppStore().events.push(
      new AlarmEvent(AlarmEventType.USER, this.name, 'Запуск насоса', new Date()),
    )

    this.enableInternal()
  }

  private enableInternal() {
    this.isStarting = true
    this.isEnabled = true
    this.enableTimestamp = new Date()

    this.startingIntervalId = setInterval(() => {
      this.isStartingFlash = !this.isStartingFlash
    }, 500)

    setTimeout(() => {
      this.isStarting = false
      this.isStartingFlash = false
      clearInterval(this.startingIntervalId)
    }, this.startTimeSeconds * 1000)
  }

  disable() {
    useAppStore().events.push(
      new AlarmEvent(AlarmEventType.USER, this.name, 'Остановка насоса', new Date()),
    )
    this.disableInternal()
  }

  private disableInternal() {
    this.isEnabled = false
    this.isStarting = false
    this.isStartingFlash = false
    clearInterval(this.startingIntervalId)
    this.enableTimestamp = undefined
  }

  get currentPerfomance() {
    if (!this.enableTimestamp) return 0

    if (this.isEnabled && !this.isStarting) return this.performance

    const timeSpent = (new Date().getTime() - this.enableTimestamp.getTime()) / 1000
    return this.performance * (1 - Math.exp(-timeSpent / this.inertia))
  }

  set isBlocked(newVal: boolean) {
    if (this.isEnabled && !this.isBlockedInernal && newVal) {
      this.disableInternal()

      useAppStore().events.push(
        new AlarmEvent(
          AlarmEventType.PROCESS,
          this.name,
          'Остановка по блокировке',
          new Date(),
          AlarmEventLevel.AL,
        ),
      )
    }

    this.isBlockedInernal = newVal
  }

  get isBlocked() {
    return this.isBlockedInernal
  }
}
