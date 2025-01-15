import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/infrastructure';
import { EntityManager } from 'typeorm';
import { IConcertDateRepository, ConcertDate } from '../../domain';
import { ConcertDateEntity } from '../entity';
import { ConcertDateMapper } from '../mapper';

@Injectable()
export class ConcertDateRepositoryImpl
  extends BaseRepository<ConcertDateEntity>
  implements IConcertDateRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(ConcertDateEntity, manager);
  }
  async saveConcertDate(concertDate: ConcertDate): Promise<ConcertDate> {
    const concertDateEntity = ConcertDateMapper.toEntity(concertDate);
    const entity = await this.save(concertDateEntity);
    return ConcertDateMapper.toDomain(entity);
  }
}
