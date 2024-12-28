import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  CONCERT_REPOSITORY,
  SEAT_REPOSITORY,
  CONCERT_PRODUCER,
} from 'src/common/application';
import { DataSource } from 'typeorm';
import { IConcertProducer } from '../event';
import { Seat, Concert, OutboxStatus } from '../model';
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

  async reserveSeat(transactionId: string, seatId: number) {
    try {
      const seat = await this.seatRepo.getSeatById(seatId);

      if (!seat) {
        throw new NotFoundException('concert', '좌석이 존재하지 않습니다.');
      }

      seat.reserve();

      await this.seatRepo.updateSeatWithOptimisticLock(seat);
    } catch (error) {
      const eventType = 'SEAT_FAILED';
      const payload = {
        transactionId,
        eventTime: new Date().toISOString(),
      };
      await this.concertRepo.saveOutbox(eventType, payload);
      await this.concertProducer.publishEvent(eventType, [
        { value: JSON.stringify(payload) },
      ]);
      throw error;
    }
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
}
