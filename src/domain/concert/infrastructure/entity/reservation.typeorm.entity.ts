import { BaseEntity } from 'src/common/entities/base-entity';
import { Entity, Column } from 'typeorm';
import { ReservationStatus } from '../../domain/model/reservation';

@Entity()
export class ReservationEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  concertDateId: number;

  @Column()
  seatId: number;

  @Column()
  status: ReservationStatus;

  @Column()
  reservedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column()
  price: number;
}
