import { Injectable, Inject } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { REDIS_QUEUE_REPOSITORY } from 'src/common/application';
import { BaseRepository } from 'src/common/infrastructure';
import { EntityManager } from 'typeorm';
import {
  IWaitingQueueRepository,
  IRedisQueueRepository,
  WaitingQueue,
  WaitingQueueStatus,
} from '../../domain';
import { WaitingQueueEntity } from '../entity';
import { WaitingQueueMapper } from '../mapper';

@Injectable()
export class WaitingQueueRepositoryImpl
  extends BaseRepository<WaitingQueueEntity>
  implements IWaitingQueueRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Inject(REDIS_QUEUE_REPOSITORY)
    private readonly redisQueueRepo: IRedisQueueRepository,
  ) {
    super(WaitingQueueEntity, manager);
  }

  async issueToken(concertDateId: number) {
    return await this.redisQueueRepo.issueToken(concertDateId);
  }

  async getWaitingTokenRank(
    concertDateId: number,
    token: string,
  ): Promise<number | null> {
    return await this.redisQueueRepo.getWaitingTokenRank(concertDateId, token);
  }

  async activateTokens(concertDateId: number, count: number): Promise<void> {
    await this.activateTokens(concertDateId, count);
  }

  async isTokenActive(concertDateId: number, token: string): Promise<boolean> {
    return await this.redisQueueRepo.isTokenActive(concertDateId, token);
  }

  async deleteToken(concertDateId: number, token: string): Promise<void> {
    await this.redisQueueRepo.deleteToken(concertDateId, token);
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
