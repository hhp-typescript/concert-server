import { BaseEntity } from 'src/common/entities/base-entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ConcertDateEntity } from './concert.date.typeorm.entity';

@Entity()
export class SeatEntity extends BaseEntity {
  @Column()
  seatNumber: number;

  @Column({ default: false })
  isReserved: boolean;

  @Column()
  price: number;

  @ManyToOne(() => ConcertDateEntity, (concertDate) => concertDate.seats)
  @JoinColumn({ name: 'concertDateId' })
  concertDate: ConcertDateEntity;
}
