import { ConcertDateId } from './concert.date.id.vo';
import { ConcertId } from './concert.id.vo';

export type NewConcertDateProps = {
  date: Date;
  ticketOpenDate: Date;
  totalSeats: number;
  concertId: ConcertId;
};

export type PersistedConcertDateProps = {
  id: ConcertDateId;
  date: Date;
  ticketOpenDate: Date;
  totalSeats: number;
  concertId: ConcertId;
};

export type ConcertDateProps = NewConcertDateProps | PersistedConcertDateProps;

export class ConcertDate {
  private constructor(private readonly props: ConcertDateProps) {}

  static createNew(props: NewConcertDateProps): ConcertDate {
    return new ConcertDate({
      date: props.date,
      ticketOpenDate: props.ticketOpenDate,
      totalSeats: props.totalSeats,
      concertId: props.concertId,
    });
  }

  static reconstitute(props: PersistedConcertDateProps): ConcertDate {
    return new ConcertDate(props);
  }

  hasId(): boolean {
    return 'id' in this.props;
  }

  get id(): ConcertDateId {
    if (!('id' in this.props)) {
      throw new Error('id가 없는 ConcertDate');
    }
    return this.props.id;
  }
  isReservationAvailable(): boolean {
    const now = new Date();
    return now >= this.props.ticketOpenDate && now <= this.props.date;
  }

  get date(): Date {
    return this.props.date;
  }
  get ticketOpenDate(): Date {
    return this.props.ticketOpenDate;
  }
  get totalSeats(): number {
    return this.props.totalSeats;
  }

  get concertId(): ConcertId {
    return this.props.concertId;
  }
}
