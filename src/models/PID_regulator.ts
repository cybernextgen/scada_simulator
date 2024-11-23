import { useAppStore } from '@/stores/appStore'
import { AlarmEvent, AlarmEventType } from './alarm_event'
import dayjs from 'dayjs'
import type { HistoryPoint } from './analog_sensor'

export class PIDRegulator {
  private isEnabledInternal: boolean = false
  private pvInternal: number = 0
  private spInternal: number = 0
  private LMNInternal: number = 0

  private pInternal: number = 1
  private iInternal: number = 0
  private dInternal: number = 0

  private integralError: number = 0
  private prevError: number = 0
  private prevPVTimestamp: Date

  constructor(
    public name: string,
    public unitsOfMeasurement: string,
    public InputLLM: number = 0,
    public InputHLM: number = 100,
    public OutputLLM: number = 0,
    public OutputHLM: number = 100,
    P: number = 1,
    I: number = 0,
    D: number = 0,
  ) {
    this.LMNInternal = OutputLLM
    this.pInternal = P
    this.iInternal = I
    this.dInternal = D
    this.prevPVTimestamp = new Date()
  }

  get P() {
    return this.pInternal
  }

  set P(newVal: number) {
    if (newVal != this.pInternal)
      useAppStore().events.push(
        new AlarmEvent(
          AlarmEventType.USER,
          this.name,
          `Изменен коэффициент P с ${this.pInternal} на ${newVal}`,
          new Date(),
        ),
      )
    this.pInternal = newVal
  }

  get I() {
    return this.iInternal
  }

  set I(newVal: number) {
    if (newVal != this.iInternal)
      useAppStore().events.push(
        new AlarmEvent(
          AlarmEventType.USER,
          this.name,
          `Изменен коэффициент I с ${this.iInternal} на ${newVal}`,
          new Date(),
        ),
      )
    this.iInternal = newVal
  }

  get D() {
    return this.dInternal
  }

  set D(newVal: number) {
    if (newVal != this.dInternal)
      useAppStore().events.push(
        new AlarmEvent(
          AlarmEventType.USER,
          this.name,
          `Изменен коэффициент D с ${this.dInternal} на ${newVal}`,
          new Date(),
        ),
      )
    this.dInternal = newVal
  }

  set LMN(newValue: number) {
    if (this.isEnabledInternal) return

    if (newValue > this.OutputHLM) newValue = this.OutputHLM
    else if (newValue < this.OutputLLM) newValue = this.OutputLLM

    if (newValue != this.LMNInternal)
      useAppStore().events.push(
        new AlarmEvent(
          AlarmEventType.USER,
          this.name,
          `Изменено управляющее воздействие с ${this.LMNInternal} на ${newValue}`,
          new Date(),
        ),
      )

    this.LMNInternal = newValue
  }

  get LMN(): number {
    return this.LMNInternal
  }

  get isEnabled() {
    return this.isEnabledInternal
  }

  set isEnabled(newVal: boolean) {
    if (newVal != this.isEnabledInternal) {
      const modeName = newVal ? 'Автомат' : 'Ручной'
      useAppStore().events.push(
        new AlarmEvent(AlarmEventType.USER, this.name, `Включен режим "${modeName}"`, new Date()),
      )
    }

    this.isEnabledInternal = newVal
  }

  get SP() {
    return this.spInternal
  }

  set SP(newValue) {
    if (newValue > this.InputHLM) newValue = this.InputHLM
    else if (newValue < this.InputLLM) newValue = this.InputLLM

    if (newValue != this.spInternal)
      useAppStore().events.push(
        new AlarmEvent(
          AlarmEventType.USER,
          this.name,
          `Изменена уставка с ${this.spInternal} на ${newValue}`,
          new Date(),
        ),
      )
    this.spInternal = newValue
  }

  get PV() {
    return this.pvInternal
  }

  set PV(newVal: number) {
    this.pvInternal = newVal

    if (this.isEnabled) {
      const error = this.SP - this.PV

      const currentTimestamp = new Date()
      const seconds = (currentTimestamp.getTime() - this.prevPVTimestamp.getTime()) / 1000

      let lmn = error * this.pInternal

      if (this.iInternal) {
        this.integralError += error
        // if (this.integralError > 100) this.integralError = 100
        // else if (this.integralError < -100) this.integralError = -100

        lmn += this.integralError * this.iInternal
      }

      if (this.dInternal) {
        const dVal = (this.dInternal * 100 * (error - this.prevError)) / seconds

        lmn += dVal
      }

      this.prevError = error

      if (lmn > this.OutputHLM) this.LMNInternal = this.OutputHLM
      else if (lmn < this.OutputLLM) this.LMNInternal = this.OutputLLM
      else this.LMNInternal = lmn
    } else {
      this.spInternal = newVal
    }
  }

  get displayValue() {
    let result = this.pvInternal
    if (this.isEnabled) {
      result = this.spInternal
    }
    return result.toFixed(0)
  }
}
