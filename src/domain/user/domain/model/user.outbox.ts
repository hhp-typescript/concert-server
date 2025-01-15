export class UserOutbox {
  id: number;
  transactionId: string;
  eventType: string;
  payload: any;
  status: OutboxStatus;

  constructor(props: {
    id?: number;
    transactionId?: string;
    eventType: string;
    payload: any;
    status?: OutboxStatus;
  }) {
    this.id = props.id;
    this.transactionId = props.transactionId;
    this.eventType = props.eventType;
    this.payload = props.payload;
    this.status = props.status;
  }
  static createNew(
    transactionId: string,
    eventType: string,
    payload: any,
  ): UserOutbox {
    return new UserOutbox({
      transactionId,
      eventType,
      payload,
      status: OutboxStatus.INIT,
    });
  }
}

export enum OutboxStatus {
  INIT = 'INIT',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
