export enum AlarmEventType {
  PROCESS,
  USER,
  SYSTEM,
}

export enum AlarmEventLevel {
  AL,
  WL,
  WH,
  AH,
}

export class AlarmEvent {
  constructor(
    public eventType: AlarmEventType,
    public position: string,
    public description: string,
    public eventTimestamp: Date,
    public eventLevel?: AlarmEventLevel,
    public ackTimestamp?: Date,
  ) {}
}
