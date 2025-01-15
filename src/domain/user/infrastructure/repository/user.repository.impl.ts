import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { OutboxStatus } from 'src/common/domain';
import { BaseRepository } from 'src/common/infrastructure';
import { Repository, EntityManager } from 'typeorm';
import { IUserRepository, User, UserOutbox } from '../../domain';
import { UserEntity } from '../entity';
import { UserMapper } from '../mapper';
import { UserOutboxEntity } from '../outbox';

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
