import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity } from 'typeorm';
import { WaitingQueueStatus } from '../../domain/model/waiting.queue';

@Entity()
export class WaitingQueueEntity extends BaseEntity {
  @Column()
  concertId: number;

  @Column()
  token: string;

  @Column()
  queueOrder: number;

  @Column({
    type: 'enum',
    enum: WaitingQueueStatus,
    default: WaitingQueueStatus.WAITING,
  })
  status: WaitingQueueStatus;

  @Column()
  expiresAt: Date;
}
