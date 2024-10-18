export class Reservation {
  id: number;
  userId: number;
  seatId: number;
  concertDateId: number;
  price: number;
  status: ReservationStatus;
  reservedAt: Date;
  expiresAt?: Date;

  constructor(args: {
    id?: number;
    userId: number;
    seatId: number;
    concertDateId: number;
    price: number;
    status: ReservationStatus;
    reservedAt: Date;
    expiresAt?: Date;
  }) {
    this.id = args.id;
    this.userId = args.userId;
    this.seatId = args.seatId;
    this.concertDateId = args.concertDateId;
    this.price = args.price;
    this.status = args.status;
    this.reservedAt = args.reservedAt;
    this.expiresAt = args.expiresAt;
  }

  confirm(): void {
    if (this.status !== ReservationStatus.TEMPORARY) {
      throw new Error('임시 배정된 좌석이 아니면 완료처리 할 수 없습니다.');
    }
    this.status = ReservationStatus.CONFIRMED;
  }

  expire(): void {
    if (this.status === ReservationStatus.CONFIRMED) {
      throw new Error('예매가 완료된 좌석은 만료처리 할 수 없습니다.');
    }
    this.status = ReservationStatus.EXPIRED;
  }
}

export enum ReservationStatus {
  TEMPORARY = 'TEMPORARY',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
}
