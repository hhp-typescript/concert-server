import { Injectable } from '@nestjs/common';
import { ConcertService } from 'src/domain/concert/domain';
import { ReservationService } from '../domain';

@Injectable()
export class ReservationFacade {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly concertService: ConcertService,
  ) {}

  async getReservationByUserId(userId: number) {
    return await this.reservationService.getReservationByUserId(userId);
  }

  async reserve(concertDateId: number, seatId: number, userId: number) {
    const seat = await this.concertService.getSeatById(seatId);

    await this.reservationService.craeteReservation(
      concertDateId,
      seat,
      userId,
    );
  }
}
