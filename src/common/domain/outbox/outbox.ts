export class Outbox {
  constructor(
    public readonly id: string,
    public readonly eventType: string,
    public readonly payload: any,
    private readonly status: OutboxStatus = OutboxStatus.INIT,
    public readonly createdAt: Date = new Date(),
  ) {}
}

export enum OutboxStatus {
  INIT = 'INIT',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
