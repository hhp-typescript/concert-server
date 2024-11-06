import { Injectable } from '@nestjs/common';
import { ConcertConcurrencyService } from '../domain/service/concert.concurrency.service';

@Injectable()
export class ConcertConcurrencyFacade {
  constructor(
    private readonly concertConcurrencyService: ConcertConcurrencyService,
  ) {}

  //비관적락 no_wait = false
  async reservePessimistic(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    await this.concertConcurrencyService.reservePessimistic(
      concertDateId,
      seatId,
      userId,
    );
  }

  //비관적락 no_wait = ture
  async reserveWithNoWaitPessimistic(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    await this.concertConcurrencyService.reserveWithNoWaitPessimistic(
      concertDateId,
      seatId,
      userId,
    );
  }

  //낙관적락
  async reserveWithOptimistic(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    await this.concertConcurrencyService.reserveOptimistic(
      concertDateId,
      seatId,
      userId,
    );
  }

  //simple Lock
  async reserveWithSimpleLock(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    await this.concertConcurrencyService.reserveWithSimpleLock(
      concertDateId,
      seatId,
      userId,
    );
  }

  //spin Lock
  async reserveWithSpinLock(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    await this.concertConcurrencyService.reserveWithSpinLock(
      concertDateId,
      seatId,
      userId,
    );
  }
}
