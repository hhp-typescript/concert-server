import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConcertFacade } from '../application/concert.facade';

@Injectable()
export class ReservationExpiryScheduler {
  constructor(private readonly concertFacade: ConcertFacade) {}

  // 매 1분마다 만료된 예약을 처리
  @Cron('*/1 * * * *')
  async handleReservationExpiry(): Promise<void> {
    await this.concertFacade.expireReservations();
  }
}
