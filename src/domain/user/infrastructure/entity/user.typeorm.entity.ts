import { BaseEntity } from 'src/common/infrastructure';
import { Entity, Column, OneToOne } from 'typeorm';
import { PointEntity } from './point.typeorm.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToOne(() => PointEntity, (point) => point.user, {
    cascade: ['insert', 'update'],
  })
  point: PointEntity;

  constructor() {
    super();
    this.point = new PointEntity();
    this.point.balance = 0;
  }
}
