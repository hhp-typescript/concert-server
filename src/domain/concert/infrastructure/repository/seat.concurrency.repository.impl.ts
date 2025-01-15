import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/infrastructure';
import { EntityManager } from 'typeorm';
import { ISeatConcurrencyRepository, Seat } from '../../domain';
import { SeatEntity } from '../entity';
import { SeatMapper } from '../mapper';

@Injectable()
export class SeatConcurrencyRepositoryImpl
  extends BaseRepository<SeatEntity>
  implements ISeatConcurrencyRepository
{
  private simpleLock = new SimpleLock();
  private spinLock = new SpinLock();
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(SeatEntity, manager);
  }

  async getSeatById(seatId: number): Promise<Seat | null> {
    const entity = await this.manager
      .createQueryBuilder(SeatEntity, 'seat')
      .leftJoinAndSelect('seat.concertDate', 'concertDate')
      .leftJoinAndSelect('concertDate.concert', 'concert')
      .where('seat.id = :seatId', { seatId })
      .getOne();

    return SeatMapper.toDomain(entity);
  }

  async saveSeat(seat: Seat): Promise<Seat> {
    const seatEntity = SeatMapper.toEntity(seat);
    const entity = await this.manager.save(seatEntity);
    return SeatMapper.toDomain(entity);
  }

  //비관적 락
  async getSeatByIdWithLock(seatId: number): Promise<Seat | null> {
    const entity = await this.manager
      .createQueryBuilder(SeatEntity, 'seat')
      .innerJoinAndSelect('seat.concertDate', 'concertDate')
      .innerJoinAndSelect('concertDate.concert', 'concert')
      .setLock('pessimistic_write') // 비관적 락 설정
      .where('seat.id = :seatId', { seatId })
      .getOne();

    return SeatMapper.toDomain(entity);
  }
  //비관적 락 no_wait포함
  async getSeatByIdWithNoWaitLock(seatId: number): Promise<Seat | null> {
    const entity = await this.manager
      .createQueryBuilder(SeatEntity, 'seat')
      .innerJoinAndSelect('seat.concertDate', 'concertDate')
      .innerJoinAndSelect('concertDate.concert', 'concert')
      .setLock('pessimistic_write_or_fail') // 비관적 락 설정 no_wait
      .where('seat.id = :seatId', { seatId })
      .getOne();

    return SeatMapper.toDomain(entity);
  }

  //낙관적락 적용
  async saveSeatWithOptimisticLock(seat: Seat): Promise<Seat> {
    const result = await this.manager
      .createQueryBuilder()
      .update(SeatEntity)
      .set({
        isReserved: seat.isReserved,
        version: () => seat.version + 1,
      })
      .where('id = :id', { id: seat.id })
      .andWhere('version = :version', { version: seat.version })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      throw new Error('낙관적 락 충돌이 발생했습니다.');
    }

    return SeatMapper.toDomain(result.raw[0]);
  }

  async saveSeatWithSimpleLock(seat: Seat): Promise<Seat> {
    this.simpleLock.acquire();
    try {
      return await this.saveSeat(seat);
    } finally {
      this.simpleLock.release();
    }
  }

  async saveSeatWithSpinLock(seat: Seat): Promise<Seat> {
    this.spinLock.acquire();
    try {
      return await this.saveSeat(seat);
    } finally {
      this.spinLock.release();
    }
  }
}
