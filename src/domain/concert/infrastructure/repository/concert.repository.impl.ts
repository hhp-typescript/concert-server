import { Injectable } from '@nestjs/common';
import { ConcertEntity } from '../entity/concert.typeorm.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BaseRepository } from 'src/common/repository/base-repository';
import { IConcertRepository } from '../../domain/repository/i.concert.repository';
import { Concert } from '../../domain/model/concert';
import { ConcertMapper } from '../mapper/concert.mapper';

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
