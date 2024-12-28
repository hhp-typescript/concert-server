import { NotFoundException } from 'src/common/domain';
import { ConcertDate } from './concert.date';

export class Seat {
  id: number;
  seatNumber: number;
  price: number;
  isReserved: boolean;
  concertDate: ConcertDate;

  constructor(args: {
    id?: number;
    concertDate?: ConcertDate;
    seatNumber: number;
    price: number;
    isReserved: boolean;
  }) {
    this.id = args.id;
    this.concertDate = args.concertDate;
    this.seatNumber = args.seatNumber;
    this.price = args.price;
    this.isReserved = args.isReserved;
  }

  reserve(): void {
    if (this.isReserved) {
      throw new Error('이미 예약된 좌석입니다.');
    }
    this.concertDate.reserveSeat();
    this.isReserved = true;
  }

  release(): void {
    this.concertDate.releaseSeat();
    this.isReserved = false;
  }
}
