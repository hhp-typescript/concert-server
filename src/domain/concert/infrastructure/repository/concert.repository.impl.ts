import { Injectable, Inject } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { SEAT_REPOSITORY } from 'src/common/application';
import { OutboxStatus } from 'src/common/domain';
import { BaseRepository } from 'src/common/infrastructure';
import { Repository, EntityManager } from 'typeorm';
import {
  IConcertRepository,
  ISeatRepository,
  Concert,
  Seat,
  ConcertOutbox,
} from '../../domain';
import { ConcertEntity, ConcertOutboxEntity } from '../entity';
import { ConcertMapper } from '../mapper';

@Injectable()
export class ConcertRepositoryImpl
  extends BaseRepository<ConcertEntity>
  implements IConcertRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(ConcertEntity, manager);
  }
  async getConcertById(concertId: number): Promise<Concert | undefined> {
    const entity = await this.manager
      .createQueryBuilder(ConcertEntity, 'concert')
      .leftJoinAndSelect('concert.concertDates', 'concertDate')
      .where('id = :concertId', { concertId })
      .getOne();

    return ConcertMapper.toDomain(entity);
  }

  async getConcertByConcertDateId(
    concertDateId: number,
  ): Promise<Concert | undefined> {
    const entity = await this.manager
      .createQueryBuilder(ConcertEntity, 'concert')
      .leftJoinAndSelect('concert.concertDates', 'concertDate')
      .leftJoinAndSelect('concertDate.seats', 'seat')
      .where('concertDate.id = :concertDateId', { concertDateId })
      .getOne();

    return ConcertMapper.toDomain(entity);
  }

  async saveConcert(concert: Concert): Promise<Concert> {
    const concertEntity = ConcertMapper.toEntity(concert);
    const savedEntity = await this.manager.save(ConcertEntity, concertEntity);
    return ConcertMapper.toDomain(savedEntity);
  }
}
