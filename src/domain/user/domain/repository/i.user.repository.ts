import { EntityManager } from 'typeorm';
import { User, UserOutbox, OutboxStatus } from '../model';

export interface IUserRepository {
  createTransactionRepo(manager: EntityManager): IUserRepository;

  getUserById(userId: number): Promise<User | null>;
  saveOutbox(eventType: string, payload: Record<string, any>): Promise<void>;
  findPendingOutbox(): Promise<UserOutbox[] | []>;
  updateOutboxStatus(
    transactionId: string,
    status: OutboxStatus,
  ): Promise<void>;
  findOutboxByTransactionId(transactionId: string): Promise<UserOutbox | null>;
}
