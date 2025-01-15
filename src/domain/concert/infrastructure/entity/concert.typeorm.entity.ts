import { Entity, Column, OneToMany } from 'typeorm';
import { ConcertDateEntity } from './concert.date.typeorm.entity';
import { BaseEntity } from 'src/common/infrastructure';

@Entity()
export class ConcertEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ConcertDateEntity, (concertDate) => concertDate.concert)
  concertDates: ConcertDateEntity[];
}
