import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity';
import { SeatEntity } from './seat.typeorm.entity';
import { ConcertEntity } from './concert.typeorm.entity';

@Entity()
export class ConcertDateEntity extends BaseEntity {
  @Column()
  date: Date;

  @Column()
  ticketOpenDate: Date;

  @Column({ default: 50 })
  totalSeats: number;

  @Column()
  reservedSeats: number;

  @ManyToOne(() => ConcertEntity, (concert) => concert.concertDates)
  @JoinColumn({ name: 'concertId' })
  concert: ConcertEntity;

  @OneToMany(() => SeatEntity, (seat) => seat.concertDate)
  seats: SeatEntity[];
}
