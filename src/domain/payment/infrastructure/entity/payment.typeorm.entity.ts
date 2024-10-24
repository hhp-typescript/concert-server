import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity } from 'typeorm';

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
