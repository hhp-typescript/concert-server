import { Entity, Column } from 'typeorm';
import { PaymentStatus } from '../../domain';
import { BaseEntity } from 'src/common/infrastructure';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @Column()
  reservationId: number;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column()
  createdAt: Date;
}
