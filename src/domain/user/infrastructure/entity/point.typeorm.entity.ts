import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.typeorm.entity';

@Entity()
export class PointEntity extends BaseEntity {
  @Column({ default: 0 })
  balance: number;

  @OneToOne(() => UserEntity, (user) => user.point)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
