import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { OutboxStatus } from 'src/common/domain';
import { BaseRepository } from 'src/common/infrastructure';
import { Repository, EntityManager } from 'typeorm';
import { IUserRepository, User, UserOutbox } from '../../domain';
import { UserEntity } from '../entity';
import { UserMapper } from '../mapper';
import { UserOutboxEntity } from '../outbox';

@Injectable()
export class UserRepositoryImpl
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  readonly outboxRepo: Repository<UserOutboxEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(UserEntity, manager);
    this.outboxRepo = manager.getRepository(UserOutboxEntity);
  }

  async getUserById(userId: number): Promise<User | undefined> {
    const entity = await this.findOne({
      where: { id: userId },
      relations: ['point'],
    });
    return UserMapper.toDomain(entity);
  }

  async saveOutbox(
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    const outbox = this.outboxRepo.create({
      eventType,
      payload,
      transactionId: payload.transactionId,
    });

    await this.outboxRepo.save(outbox);
  }

  async findPendingOutbox(): Promise<UserOutbox[] | []> {
    const entities = await this.manager
      .createQueryBuilder(UserOutboxEntity, 'userOutbox')
      .where('userOutbox.status = :status', { status: OutboxStatus.INIT })
      .getMany();

    return entities.map((entity) => new UserOutbox(entity));
  }

  async updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void> {
    await this.manager.update(UserOutboxEntity, { transactionId }, { status });
  }

  async findOutboxByTransactionId(
    transactionId: string,
  ): Promise<UserOutbox | null> {
    const entity = await this.manager
      .createQueryBuilder(UserOutboxEntity, 'userOutbox')
      .where('userOutbox.transactionId = :transactionId', { transactionId })
      .getOne();

    return new UserOutbox(entity);
  }
}
