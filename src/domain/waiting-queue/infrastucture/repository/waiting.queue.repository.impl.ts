import { Injectable } from '@nestjs/common';
import { WaitingQueueEntity } from '../entity/waiting.queue.typeorm.entity';
import { IWaitingQueueRepository } from '../../domain/repository/i.waiting.queue.repository';
import { BaseRepository } from 'src/common/repository/base-repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  WaitingQueue,
  WaitingQueueStatus,
} from '../../domain/model/waiting.queue';
import { WaitingQueueMapper } from '../mapper/waiting.queue.mapper';

@Injectable()
export class WaitingQueueRepositoryImpl
  extends BaseRepository<WaitingQueueEntity>
  implements IWaitingQueueRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(WaitingQueueEntity, manager);
  }
  // 대기열 저장
  async saveQueue(queue: WaitingQueue): Promise<WaitingQueue> {
    const entity = WaitingQueueMapper.toEntity(queue);
    const savedEntity = await this.manager.save(entity);
    return WaitingQueueMapper.toDomain(savedEntity);
  }

  async findExpiredQueues(): Promise<WaitingQueue[]> {
    const now = new Date();
    const entities = await this.manager
      .createQueryBuilder(WaitingQueueEntity, 'waitingQueue')
      .where('waitingQueue.expiresAt <= :now', { now })
      .andWhere('waitingQueue.status = :status', {
        status: WaitingQueueStatus.ACTIVE,
      })
      .getMany();
    return entities.map(WaitingQueueMapper.toDomain);
  }

  async findQueueByToken(token: string): Promise<WaitingQueue | undefined> {
    const entity = await this.findOne({
      where: { token },
    });
    return entity ? WaitingQueueMapper.toDomain(entity) : undefined;
  }

  // 특정 콘서트에서 가장 높은 queueOrder 값 가져오기
  async getWaitingQueuesForConcert(concertId: number): Promise<WaitingQueue[]> {
    const entities = await this.manager
      .createQueryBuilder(WaitingQueueEntity, 'waitingQueue')
      .where('waitingQueue.concertId = :concertId', { concertId })
      .andWhere('waitingQueue.status = :status', {
        status: WaitingQueueStatus.WAITING,
      })
      .orderBy('waitingQueue.queueOrder', 'ASC') // queueOrder를 오름차순으로 정렬
      .limit(50) // 50명씩 가져오기
      .getMany();

    return entities.map((entity) => WaitingQueueMapper.toDomain(entity));
  }
  async getMaxQueueOrderForConcert(concertId: number): Promise<number> {
    const result = await this.manager
      .createQueryBuilder(WaitingQueueEntity, 'waitingQueue')
      .select('MAX(waitingQueue.queueOrder)', 'max')
      .where('waitingQueue.concertId = :concertId', { concertId })
      .getRawOne();

    return result?.max || 0;
  }
  // 대기열 상태 업데이트
  async updateQueues(queues: WaitingQueue[]): Promise<void> {
    const entities = queues.map((queue) => WaitingQueueMapper.toEntity(queue));
    await this.save(entities);
  }
}
