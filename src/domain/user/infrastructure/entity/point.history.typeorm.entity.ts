import { BaseEntity } from 'src/common/infrastructure';
import { Entity, Column } from 'typeorm';
import { PointHistoryType } from '../../domain';

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
