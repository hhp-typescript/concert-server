import { NotFoundException } from 'src/common/domain';
import { SeatId } from './seat.id.vo';
import { ConcertDateId } from './concert.date.id.vo';

export type NewSeatProps = {
  seatNumber: number;
  price: number;
  status: SeatStatus;
  concertDateId: ConcertDateId;
  version: number;
};

export type PersistedSeatProps = {
  id: SeatId;
  seatNumber: number;
  price: number;
  status: SeatStatus;
  concertDateId: ConcertDateId;
  version: number;
};

export enum SeatStatus {
  UNRESERVED = 'UNRESERVED',
  TEMPORARY = 'TEMPORARY',
  CONFIRMED = 'CONFIRMED',
}
export type SeatProps = NewSeatProps | PersistedSeatProps;

export class Seat {
  private constructor(private readonly props: SeatProps) {}

  static createNew(props: NewSeatProps): Seat {
    return new Seat({
      ...props,
      version: 0,
    });
  }

  static reconstitute(props: PersistedSeatProps): Seat {
    return new Seat(props);
  }

  isReseved(): void {
    if (this.props.status !== SeatStatus.UNRESERVED) {
      throw new NotFoundException('concert', '이미 예약된 좌석입니다');
    }
  }
  reserve(): void {
    this.props.status = SeatStatus.TEMPORARY;
  }

  release(): void {
    this.props.status = SeatStatus.UNRESERVED;
  }

  confiremd(): void {
    this.props.status = SeatStatus.CONFIRMED;
  }

  hasId(): boolean {
    return 'id' in this.props;
  }

  get id(): SeatId {
    if (!('id' in this.props)) throw new Error('id가 없는 Seat');

    return this.props.id;
  }

  get seatNumber(): number {
    return this.props.seatNumber;
  }

  get price(): number {
    return this.props.price;
  }
  get status(): SeatStatus {
    return this.props.status;
  }

  get version(): number {
    return this.props.version;
  }

  get concertDateId(): ConcertDateId {
    return this.props.concertDateId;
  }
}
