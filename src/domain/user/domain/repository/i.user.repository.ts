import { EntityManager } from 'typeorm';
import { User, UserOutbox, OutboxStatus } from '../model';

export interface IUserRepository {
  getUserById(userId: number): Promise<User | undefined>;
}
