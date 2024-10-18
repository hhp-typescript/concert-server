import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity } from 'typeorm';
import { PointHistoryType } from '../../domain/model/point.history';

@Entity()
export class PointHistoryEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PointHistoryType,
  })
  type: PointHistoryType;
}
