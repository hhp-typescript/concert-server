import { BaseEntity } from 'src/common/infrastructure';
import { Column, Entity } from 'typeorm';
import { WaitingQueueStatus } from '../../domain';

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

  @Column({ nullable: true })
  expiresAt: Date;
}
