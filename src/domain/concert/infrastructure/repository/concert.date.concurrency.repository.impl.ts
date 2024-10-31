import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BaseRepository } from 'src/common/repository/base.repository';
import { IConcertDateConcurrencyRepository } from '../../domain/repository/i.concert.date.concurrency.repository';
import { ConcertDate } from '../../domain/model/concert.date';
import { ConcertDateMapper } from '../mapper/concert.date.mapper';
import { ConcertDateEntity } from '../entity/concert.date.typeorm.entity';

@Injectable()
export class ConcertDateConcurrencyRepositoryImpl
  extends BaseRepository<ConcertDateEntity>
  implements IConcertDateConcurrencyRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(ConcertDateEntity, manager);
  }
  async saveConcertDate(concertDate: ConcertDate): Promise<ConcertDate | null> {
    const concertDateEntity = ConcertDateMapper.toEntity(concertDate);
    const entity = await this.save(concertDateEntity);
    return ConcertDateMapper.toDomain(entity);
  }
}
