import { Seat } from './seat';

export class ConcertDate {
  id: number;
  concertId: number;
  date: Date;
  ticketOpenDate: Date;
  seats: Seat[];
  totalSeats: number;
  reservedSeats: number;

  constructor(args: {
    id?: number;
    concertId: number;
    date: Date;
    ticketOpenDate: Date;
    seats?: Seat[];
    totalSeats: number;
    reservedSeats?: number;
  }) {
    this.id = args.id;
    this.concertId = args.concertId;
    this.date = args.date;
    this.ticketOpenDate = args.ticketOpenDate;
    this.seats = args.seats || [];
    this.totalSeats = args.totalSeats;
    this.reservedSeats = args.reservedSeats || 0;
  }
  reserveSeat(): void {
    this.reservedSeats += 1;
  }

  releaseSeat(): void {
    this.reservedSeats -= 1;
  }

  getAvailableSeats(): void {
    this.seats = this.seats.filter((seat) => !seat.isReserved);
  }

  isReservationAvailable(): boolean {
    const now = new Date();
    return now >= this.ticketOpenDate && now <= this.date;
  }
}
