import { WaitingQueue } from '../model/waiting.queue';

export interface IWaitingQueueRepository {
  issueToken(concertDateId: number): Promise<string>;
  getWaitingTokenRank(
    concertDateId: number,
    token: string,
  ): Promise<number | null>;
  activateTokens(concertDateId: number, count: number): Promise<void>;
  isTokenActive(concertDateId: number, token: string): Promise<boolean>;
  deleteToken(concertDateId: number, token: string): Promise<void>;

  saveQueue(queue: WaitingQueue): Promise<WaitingQueue>;
  findExpiredQueues(): Promise<WaitingQueue[]>;
  findQueueByToken(token: string): Promise<WaitingQueue | undefined>;
  getWaitingQueuesForConcert(concertId: number): Promise<WaitingQueue[]>;
  getMaxQueueOrderForConcert(concertId: number): Promise<number>;
  updateQueues(queues: WaitingQueue[]): Promise<void>;
}
