import { BaseEntity } from 'src/common/infrastructure';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.typeorm.entity';

@Entity()
export class PointEntity extends BaseEntity {
  @Column({ default: 0 })
  balance: number;

  @OneToOne(() => UserEntity, (user) => user.point)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
