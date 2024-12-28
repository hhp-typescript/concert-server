import { BaseRepository } from '../repository/base.repository';
import { DeepPartial, EntityManager, EntityTarget } from 'typeorm';
import { BaseOutboxEntity } from './base.outbox.entity';
import { OutboxStatus } from 'src/common/domain/outbox/outbox';

export class BaseOutboxRepository<
  Entity extends BaseOutboxEntity,
> extends BaseRepository<Entity> {
  constructor(
    readonly targetEntity: EntityTarget<Entity>,
    readonly manager: EntityManager,
  ) {
    super(targetEntity, manager);
  }

  async saveOutbox(event: Partial<Entity>): Promise<Entity> {
    const entity = this.create(event as DeepPartial<Entity>);
    return await this.save(entity);
  }

  async findUnprocessedEvents(): Promise<Entity[]> {
    return this.find({
      where: { status: OutboxStatus.INIT } as any, // 타입 강제
    });
  }

  async markAsProcessed(id: string): Promise<void> {
    await this.update(id, { status: OutboxStatus.SUCCESS } as any);
  }

  async markAsFailed(id: string): Promise<void> {
    await this.update(id, { status: OutboxStatus.FAIL } as any);
  }
}
