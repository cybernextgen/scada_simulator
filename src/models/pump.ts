export class Pump {
  private startingIntervalId?: number = undefined
  private enableTimestamp?: Date = undefined
  public isStartingFlash: boolean = false
  public isEnabled: boolean = false
  public isStarting: boolean = false

  constructor(
    public name: string,
    public performance: number,
    public startTimeSeconds = 10,
    public inertia = 0.2,
  ) {}

  enable() {
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
}
