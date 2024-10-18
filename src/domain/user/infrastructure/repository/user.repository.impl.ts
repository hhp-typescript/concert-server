import { BaseRepository } from 'src/common/repository/base-repository';
import { UserEntity } from '../entity';
import { IUserRepository } from '../../domain/repository/i.user.repository';
import { User } from '../../domain/model/user';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserMapper } from '../mapper/user.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryImpl
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(UserEntity, manager);
  }

  async getUserById(userId: number): Promise<User | undefined> {
    const entity = await this.findOne({
      where: { id: userId },
      relations: ['point'],
    });
    return UserMapper.toDomain(entity);
  }
}
