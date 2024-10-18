import { ConcertDate } from './concert.date';

export class Concert {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  concertDates: ConcertDate[];

  constructor(args: {
    id?: number;
    name: string;
    description: string;
    concertDates?: ConcertDate[];
  }) {
    this.id = args.id;
    this.name = args.name;
    this.description = args.description;
    this.concertDates = args.concertDates || [];
  }

  getAvailableSeats(concertDateId: number): void {
    const concertDate = this.concertDates.find(
      (concertDate) => concertDate.id === concertDateId,
    );
    if (!concertDate) {
      throw new Error('콘서트가 조회되지 않습니다.');
    }
    concertDate.getAvailableSeats();
  }

  getAvailableConcertDates(): void {
    this.concertDates = this.concertDates.filter((concertDate) =>
      concertDate.isReservationAvailable(),
    );
  }
}
