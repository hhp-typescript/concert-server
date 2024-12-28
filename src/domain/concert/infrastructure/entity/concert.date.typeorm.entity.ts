import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ConcertEntity } from './concert.typeorm.entity';
import { SeatEntity } from './seat.typeorm.entity';
import { BaseEntity } from 'src/common/infrastructure';

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
