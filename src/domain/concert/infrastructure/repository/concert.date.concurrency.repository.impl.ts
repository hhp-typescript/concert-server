import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/infrastructure';
import { EntityManager } from 'typeorm';
import { IConcertDateConcurrencyRepository, ConcertDate } from '../../domain';
import { ConcertDateEntity } from '../entity';
import { ConcertDateMapper } from '../mapper';

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
