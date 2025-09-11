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
}
