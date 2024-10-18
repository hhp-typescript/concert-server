import { v4 as uuidv4 } from 'uuid';
export class WaitingQueue {
  token: string;
  concertId: number;
  queueOrder: number;
  status: WaitingQueueStatus;
  expiresAt: Date;

  constructor(args: {
    concertId: number;
    queueOrder: number;
    status?: WaitingQueueStatus;
    expiresAt?: Date;
  }) {
    this.token = uuidv4();
    this.concertId = args.concertId;
    this.queueOrder = args.queueOrder;
    this.status = args.status;
    this.expiresAt = args.expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  activate(): void {
    if (this.status === WaitingQueueStatus.WAITING) {
      this.status = WaitingQueueStatus.ACTIVE;
      // 활성화 후 5분 동안 유효
      this.expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);
    }
  }

  expire(): void {
    this.status = WaitingQueueStatus.EXPIRED;
  }
}

export enum WaitingQueueStatus {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}
