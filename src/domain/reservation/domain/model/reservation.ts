import { BadRequestException } from 'src/common/domain';
import { ConcertDateId, SeatId } from 'src/domain/concert/domain';
import { ReservationId } from './reservation.id.vo';
import { UserId } from 'src/domain/user/domain';

export enum ReservationStatus {
  TEMPORARY = 'TEMPORARY',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
}

export type NewReservationProps = {
  userId: UserId;
  seatId: SeatId;
  concertDateId: ConcertDateId;
  price: number;
  status: ReservationStatus;
  version: number;
};
export type PersistedReservationProps = {
  id: ReservationId;
  userId: UserId;
  seatId: SeatId;
  concertDateId: ConcertDateId;
  price: number;
  status: ReservationStatus;
  reservedAt: Date;
  expiresAt: Date;
  version: number;
};

//TODO 중간이후 user, seat, concertDate를 팩토리 메서드 이용해서 뺄 건지 고민
export type reservationProps = NewReservationProps | PersistedReservationProps;
export class Reservation {
  private constructor(private props: reservationProps) {}

  static createNew(props: NewReservationProps): Reservation {
    return new Reservation({ ...props });
  }

  static reconstitute(props: PersistedReservationProps): Reservation {
    return new Reservation(props);
  }

  isValid(): boolean {
    return this.props.status === ReservationStatus.TEMPORARY;
  }

  validate(): void {
    if (!this.isValid()) {
      throw new BadRequestException('reservation');
    }
  }

  confirm(): void {
    if (this.props.status !== ReservationStatus.TEMPORARY) {
      throw new Error('임시 배정된 좌석이 아니면 완료처리 할 수 없습니다.');
    }
    this.props.status = ReservationStatus.CONFIRMED;
  }

  expire(): void {
    if (this.props.status === ReservationStatus.CONFIRMED) {
      throw new Error('예매가 완료된 좌석은 만료처리 할 수 없습니다.');
    }
    this.props.status = ReservationStatus.EXPIRED;
  }

  hasId(): boolean {
    return 'id' in this.props;
  }

  get id(): ReservationId {
    if (!('id' in this.props)) throw new Error('id가 없는 Reservation');

    return this.props.id;
  }

  get userId(): UserId {
    return this.props.userId;
  }
  get seatId(): SeatId {
    return this.props.seatId;
  }
  get concertDateId(): ConcertDateId {
    return this.props.concertDateId;
  }
  get price(): number {
    return this.props.price;
  }
  get status(): ReservationStatus {
    return this.props.status;
  }
  get reservedAt(): Date | undefined {
    if (!('reservedAt' in this.props))
      throw new Error('reservedAt 없는 Reservation');

    return this.props.reservedAt;
  }
  get expiresAt(): Date | undefined {
    if (!('expiresAt' in this.props))
      throw new Error('expiresAt 없는 Reservation');

    return this.props.expiresAt;
  }
  get version(): number {
    return this.props.version;
  }
}
