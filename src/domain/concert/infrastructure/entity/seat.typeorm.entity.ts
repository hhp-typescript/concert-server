import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SeatStatus } from '../../domain';
import { ConcertDateEntity } from './concert.date.typeorm.entity';
import { BaseEntity } from 'src/common/infrastructure';

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
