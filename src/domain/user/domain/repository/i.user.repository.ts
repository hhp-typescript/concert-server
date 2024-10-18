import { User } from '../model/user';

export interface IUserRepository {
  getUserById(userId: number): Promise<User | undefined>;
}
