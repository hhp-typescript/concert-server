import { WaitingQueue } from '../../domain/model/waiting.queue';
import { WaitingQueueEntity } from '../entity/waiting.queue.typeorm.entity';

export class WaitingQueueMapper {
  static toDomain(entity: WaitingQueueEntity): WaitingQueue {
    return new WaitingQueue({
      concertId: entity.concertId,
      queueOrder: entity.queueOrder,
      status: entity.status,
      expiresAt: entity.expiresAt,
    });
  }

  static toEntity(domain: WaitingQueue): WaitingQueueEntity {
    const entity = new WaitingQueueEntity();
    entity.concertId = domain.concertId;
    entity.queueOrder = domain.queueOrder;
    entity.status = domain.status;
    entity.token = domain.token;
    entity.expiresAt = domain.expiresAt;
    return entity;
  }
}
