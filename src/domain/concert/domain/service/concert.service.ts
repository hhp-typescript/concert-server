import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  CONCERT_REPOSITORY,
  SEAT_REPOSITORY,
  CONCERT_PRODUCER,
} from 'src/common/application';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IConcertProducer } from '../event';
import { Seat, Concert, OutboxStatus, SeatStatus } from '../model';
import { IConcertRepository, ISeatRepository } from '../repository';
import { NotFoundException } from 'src/common/domain';

@Injectable()
export class ConcertService {
  constructor(
    @Inject(CONCERT_REPOSITORY)
    private readonly concertRepo: IConcertRepository,
    @Inject(SEAT_REPOSITORY)
    private readonly seatRepo: ISeatRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(CONCERT_PRODUCER)
    private readonly concertProducer: IConcertProducer,
  ) {}

  async reserve(seatId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //TODO repository 진입점을 하나로 할지 뭐 이런거..
      const txSeatRepo = this.seatRepo.createTransactionRepo(
        queryRunner.manager,
      );

      const txConcertRepo = this.concertRepo.createTransactionRepo(
        queryRunner.manager,
      );

      const seat = await txSeatRepo.getSeatById(seatId);

      if (!seat) {
        throw new NotFoundException('concert', '좌석이 존재하지 않습니다.');
      }

      seat.isReseved();

      seat.reserve();
      const reservedSeat = await txSeatRepo.updateSeatWithOptimisticLock(seat);

      const eventType = 'SEAT_COMPLETED';
      const transactionId = uuidv4();

      const payload = {
        userId,
        seatId,
        concertDateId: seat.concertDate.id,
        transactionId,
        eventTime: new Date().toISOString(),
      };

      await txConcertRepo.saveOutbox(eventType, payload);
      await queryRunner.commitTransaction();

      await this.concertProducer.publishEvent(eventType, [
        { value: JSON.stringify(payload) },
      ]);

      return reservedSeat;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async test() {
    const seat = await this.seatRepo.saveSeat(
      new Seat({
        id: 9999999,
        seatNumber: 9999999,
        price: 1000,
        status: SeatStatus.UNRESERVED,
      }),
    );

    console.log('concert service에서!!!', seat);
  }

  async getAvailableSeats(concertDateId: number): Promise<Seat[] | []> {
    const seats =
      await this.concertRepo.getAvailableSeatsByConcertDateId(concertDateId);

    if (!seats) {
      throw new NotFoundException('concert');
    }

    return seats;
  }

  async getAvailableDates(concertId: number): Promise<Concert> {
    const concert = await this.concertRepo.getConcertById(concertId);

    if (!concert) {
      throw new NotFoundException('concert');
    }

    concert.getAvailableConcertDates();

    return concert;
  }

  async getSeatById(seatId: number): Promise<Seat | null> {
    const seat = await this.seatRepo.getSeatById(seatId);
    if (!seat) {
      throw new NotFoundException('concert', '좌석이 존재하지 않습니다');
    }

    return seat;
  }

  async updateOutboxStatus(transactionId: string, status: OutboxStatus) {
    await this.concertRepo.updateOutboxStatus(transactionId, status);
  }

  async failReservation(transactionId: string) {
    const outbox =
      await this.concertRepo.findOutboxByTransactionId(transactionId);
    if (!outbox) {
      throw new Error('Concert outbox not found');
    }
    const {
      payload: { seat },
    } = outbox;

    seat.release();

    await this.seatRepo.updateSeatWithOptimisticLock(seat);
  }
}
