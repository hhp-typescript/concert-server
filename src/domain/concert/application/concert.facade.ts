// application/concert/concert.facade.ts
import { Injectable } from '@nestjs/common';
import { ConcertService } from '../domain';

@Injectable()
export class ConcertFacade {
  constructor(
    private readonly concertService: ConcertService,
    private readonly reservationService: ReservationService,
  ) {}

  async getAvailableSeats(concertDateId: number) {
    return await this.concertService.getAvailableSeats(concertDateId);
  }
  async getAvailableDates(concertId: number) {
    return await this.concertService.getAvailableDates(concertId);
  }

  async reserveSeat(concertDateId: number, seatId: number, userId: number) {
    return await this.reservationService.reserveSeat(
      concertDateId,
      seatId,
      userId,
    );
  }
  async expireReservations() {
    await this.reservationService.expireReservations();
  }
}
