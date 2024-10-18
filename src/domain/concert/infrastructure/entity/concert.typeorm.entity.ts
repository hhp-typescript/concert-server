import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity';
import { ConcertDateEntity } from './concert.date.typeorm.entity';

@Entity()
export class ConcertEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ConcertDateEntity, (concertDate) => concertDate.concert)
  concertDates: ConcertDateEntity[];
}
