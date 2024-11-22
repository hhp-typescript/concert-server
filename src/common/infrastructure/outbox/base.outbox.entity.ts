import { Column } from 'typeorm';
import { BaseEntity } from '../entity';
import { OutboxStatus } from 'src/common/domain/outbox/outbox';

export abstract class BaseOutboxEntity extends BaseEntity {
  @Column()
  transactionId: string;

  @Column()
  eventType: string;

  @Column('json')
  payload: any;

  @Column({
    type: 'enum',
    enum: OutboxStatus,
    default: OutboxStatus.INIT,
  })
  status: OutboxStatus;
}
