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
  ) {}

  async getAvailableSeats(concertDateId: number): Promise<Concert> {
    const concert =
      await this.concertRepo.getConcertByConcertDateId(concertDateId);
    if (!concert) {
      throw new NotFoundException('콘서트가 존재하지 않습니다');
    }

    concert.getAvailableSeats(concertDateId);

    return concert;
  }

  async getAvailableDates(concertId: number): Promise<Concert> {
    const concert = await this.concertRepo.getConcertById(concertId);

    if (!concert) {
      throw new NotFoundException('콘서트가 존재하지 않습니다');
    }

    concert.getAvailableConcertDates();

    return concert;
  }
}
