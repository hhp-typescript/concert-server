import { BaseRepository } from 'src/common/repository/base-repository';
import { IConcertDateRepository } from '../../domain/repository/i.concert.date.repository';
import { ConcertDateEntity } from '../entity/concert.date.typeorm.entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ConcertDate } from '../../domain/model/concert.date';
import { ConcertDateMapper } from '../mapper/concert.date.mapper';

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
