import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base-repository';
import { ISeatRepository } from '../../domain/repository/i.seat.repository';
import { SeatEntity } from '../entity/seat.typeorm.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Seat } from '../../domain/model/seat';
import { SeatMapper } from '../mapper/seat.mapper';

@Injectable()
export class SeatRepositoryImpl
  extends BaseRepository<SeatEntity>
  implements ISeatRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(SeatEntity, manager);
  }

  async getSeatsByIds(seatIds: number[]): Promise<Seat[] | []> {
    const entities = await this.manager
      .createQueryBuilder(SeatEntity, 'seat')
      .where('seat.id IN (:...seatIds)', { seatIds })
      .leftJoinAndSelect('seat.concertDate', 'concertDate')
      .getMany();

    return entities.map((entity) => SeatMapper.toDomain(entity));
  }

  async getSeatById(seatId: number): Promise<Seat | null> {
    const entity = await this.findOne({
      where: { id: seatId },
      relations: ['concertDates'],
    });

    return SeatMapper.toDomain(entity);
  }

  async saveSeat(Seat: Seat): Promise<Seat> {
    const SeatEntity = SeatMapper.toEntity(Seat);
    const entity = await this.save(SeatEntity);
    return SeatMapper.toDomain(entity);
  }

  async saveSeats(seats: Seat[]): Promise<void> {
    const seatEntities = seats.map((seat) => SeatMapper.toEntity(seat));

    await this.save(seatEntities);
  }
}
