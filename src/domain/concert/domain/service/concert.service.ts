// domain/concert/concert.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CONCERT_REPOSITORY } from 'src/common/const';
import { IConcertRepository } from '../repository/i.concert.repository';
import { Concert } from '../model/concert';

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
