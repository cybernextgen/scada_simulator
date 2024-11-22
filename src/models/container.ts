export class Container {
  private volumeInternal: number = 0

  constructor(
    public capacity: number,
    initialVolume: number = 0,
  ) {
    this.volumeInternal = initialVolume
  }

  get volume() {
    return this.volumeInternal
  }

  set volume(newVal: number) {
    this.volumeInternal = newVal
    this.strip()
  }

  get level() {
    return (this.volumeInternal * 100) / this.capacity
  }

  public incrementVolume(increment: number) {
    this.volumeInternal += increment
    this.strip()
  }

  public decrementVolume(decrement: number) {
    this.volumeInternal -= decrement
    this.strip()
  }

  private strip() {
    if (this.volumeInternal > this.capacity) {
      this.volumeInternal = this.capacity
    } else if (this.volumeInternal < 0) {
      this.volumeInternal = 0
    }
  }
}
