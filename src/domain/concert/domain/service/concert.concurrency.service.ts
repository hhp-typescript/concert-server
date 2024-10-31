import { Inject, Injectable } from '@nestjs/common';
import {
  CONCERT_CONCURRENCY_REPOSITORY,
  RESERVATION_CONCURRENCY_REPOSITORY,
  SEAT_CONCURRENCY_REPOSITORY,
} from 'src/common/const';
import { ISeatConcurrencyRepository } from '../repository/i.seat.concurrency.repository';
import { NotFoundException } from 'src/common/exception';
import { IConcertDateConcurrencyRepository } from '../repository/i.concert.date.concurrency.repository';
import { IReservationConcurrencyRepository } from '../repository/i.reservation.concurrency.repository';
import { Transactional } from 'src/common/lib/decorator/transaction.decorator';
import { InjectTransactionManager } from 'src/common/lib/decorator/inject.manager.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Reservation } from '../model/reservation';

@Injectable()
export class ConcertConcurrencyService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(CONCERT_CONCURRENCY_REPOSITORY)
    private readonly concertDateConcurrencyRepo: IConcertDateConcurrencyRepository,
    @Inject(SEAT_CONCURRENCY_REPOSITORY)
    private readonly seatConcurrencyRepo: ISeatConcurrencyRepository,
    @Inject(RESERVATION_CONCURRENCY_REPOSITORY)
    private readonly reservationConcurrencyRepo: IReservationConcurrencyRepository,
  ) {}

  //비관적 락
  @Transactional()
  @InjectTransactionManager([
    'seatConcurrencyRepo',
    'reservationConcurrencyRepo',
    'concertDateConcurrencyRepo',
  ])
  async reservePessimistic(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    const seat = await this.seatConcurrencyRepo.getSeatByIdWithLock(seatId);

    if (!seat) {
      throw new NotFoundException('concert', '해당 좌석을 찾을 수 없습니다.');
    }

    if (seat.isReserved) {
      console.log(seat);
      throw new Error('이미 예약된 좌석입니다');
    }

    seat.reserve();
    const [reservationResult, seatResult, concertDateResult] =
      await Promise.allSettled([
        this.reservationConcurrencyRepo.createReservation(
          concertDateId,
          seat,
          userId,
        ),
        this.seatConcurrencyRepo.saveSeat(seat),
        this.concertDateConcurrencyRepo.saveConcertDate(seat.concertDate),
      ]);

    // 에러가 있는지 확인
    const hasError = [reservationResult, seatResult, concertDateResult].some(
      (result) => result.status === 'rejected',
    );

    if (hasError) {
      throw new Error('좌석 예약에 실패했습니다. 다시 시도해주세요.');
    }

    if (reservationResult.status === 'fulfilled') {
      return reservationResult.value;
    }
  }

  // 비관적 락 no_wait
  @Transactional()
  @InjectTransactionManager([
    'seatConcurrencyRepo',
    'reservationConcurrencyRepo',
    'concertDateConcurrencyRepo',
  ])
  async reserveWithNoWaitPessimistic(
    concertDateId: number,
    seatId: number,
    userId: number,
  ) {
    const seat =
      await this.seatConcurrencyRepo.getSeatByIdWithNoWaitLock(seatId);

    if (!seat) {
      throw new NotFoundException('concert', '해당 좌석을 찾을 수 없습니다.');
    }

    if (seat.isReserved) {
      console.log(seat);
      throw new Error('이미 예약된 좌석입니다');
    }

    seat.reserve();
    const [reservationResult, seatResult, concertDateResult] =
      await Promise.allSettled([
        this.reservationConcurrencyRepo.createReservation(
          concertDateId,
          seat,
          userId,
        ),
        this.seatConcurrencyRepo.saveSeat(seat),
        this.concertDateConcurrencyRepo.saveConcertDate(seat.concertDate),
      ]);

    // 에러가 있는지 확인
    const hasError = [reservationResult, seatResult, concertDateResult].some(
      (result) => result.status === 'rejected',
    );

    if (hasError) {
      throw new Error('좌석 예약에 실패했습니다. 다시 시도해주세요.');
    }

    if (reservationResult.status === 'fulfilled') {
      return reservationResult.value;
    }
  }

  // 낙관적 락
  @Transactional()
  @InjectTransactionManager([
    'seatConcurrencyRepo',
    'reservationConcurrencyRepo',
    'concertDateConcurrencyRepo',
  ])
  async reserveOptimistic(
    concertDateId: number,
    seatId: number,
    userId: number,
  ): Promise<Reservation> {
    const seat = await this.seatConcurrencyRepo.getSeatById(seatId);

    if (!seat) {
      throw new NotFoundException('concert', '해당 좌석을 찾을 수 없습니다.');
    }

    if (seat.isReserved) {
      throw new Error('이미 예약된 좌석입니다.');
    }

    seat.reserve();

    const [reservationResult, seatResult, concertDateResult] =
      await Promise.allSettled([
        this.reservationConcurrencyRepo.createReservation(
          concertDateId,
          seat,
          userId,
        ),
        this.seatConcurrencyRepo.saveSeatWithOptimisticLock(seat),
        this.concertDateConcurrencyRepo.saveConcertDate(seat.concertDate),
      ]);

    const hasError = [reservationResult, seatResult, concertDateResult].some(
      (result) => result.status === 'rejected',
    );

    if (hasError) {
      throw new Error('좌석 예약에 실패했습니다. 다시 시도해주세요.');
    }

    if (reservationResult.status === 'fulfilled') {
      return reservationResult.value;
    }
  }

  @Transactional()
  @InjectTransactionManager([
    'seatConcurrencyRepo',
    'reservationConcurrencyRepo',
    'concertDateConcurrencyRepo',
  ])
  async reserveWithSimpleLock(
    concertDateId: number,
    seatId: number,
    userId: number,
  ): Promise<Reservation> {
    const seat = await this.seatConcurrencyRepo.getSeatById(seatId);
    if (!seat) {
      throw new NotFoundException('concert', '해당 좌석을 찾을 수 없습니다.');
    }

    if (seat.isReserved) {
      throw new Error('이미 예약된 좌석입니다.');
    }

    seat.reserve();

    const [reservationResult, seatResult, concertDateResult] =
      await Promise.allSettled([
        this.reservationConcurrencyRepo.createReservation(
          concertDateId,
          seat,
          userId,
        ),
        this.seatConcurrencyRepo.saveSeatWithSimpleLock(seat),
        this.concertDateConcurrencyRepo.saveConcertDate(seat.concertDate),
      ]);

    const hasError = [reservationResult, seatResult, concertDateResult].some(
      (result) => result.status === 'rejected',
    );

    if (hasError) {
      throw new Error('좌석 예약에 실패했습니다. 다시 시도해주세요.');
    }

    if (reservationResult.status === 'fulfilled') {
      return reservationResult.value;
    }
  }

  @Transactional()
  @InjectTransactionManager([
    'seatConcurrencyRepo',
    'reservationConcurrencyRepo',
    'concertDateConcurrencyRepo',
  ])
  async reserveWithSpinLock(
    concertDateId: number,
    seatId: number,
    userId: number,
  ): Promise<Reservation> {
    const seat = await this.seatConcurrencyRepo.getSeatById(seatId);
    if (!seat) {
      throw new NotFoundException('concert', '해당 좌석을 찾을 수 없습니다.');
    }

    if (seat.isReserved) {
      throw new Error('이미 예약된 좌석입니다.');
    }

    seat.reserve();

    const [reservationResult, seatResult, concertDateResult] =
      await Promise.allSettled([
        this.reservationConcurrencyRepo.createReservation(
          concertDateId,
          seat,
          userId,
        ),
        this.seatConcurrencyRepo.saveSeatWithSpinLock(seat),
        this.concertDateConcurrencyRepo.saveConcertDate(seat.concertDate),
      ]);

    const hasError = [reservationResult, seatResult, concertDateResult].some(
      (result) => result.status === 'rejected',
    );

    if (hasError) {
      throw new Error('좌석 예약에 실패했습니다. 다시 시도해주세요.');
    }

    if (reservationResult.status === 'fulfilled') {
      return reservationResult.value;
    }
  }
}
