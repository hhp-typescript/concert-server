import { WaitingQueue } from '../model/waiting.queue';

export interface IWaitingQueueRepository {
  saveQueue(queue: WaitingQueue): Promise<WaitingQueue>;
  findExpiredQueues(): Promise<WaitingQueue[]>;
  findQueueByToken(token: string): Promise<WaitingQueue | undefined>;
  getWaitingQueuesForConcert(concertId: number): Promise<WaitingQueue[]>;
  getMaxQueueOrderForConcert(concertId: number): Promise<number>;
  updateQueues(queues: WaitingQueue[]): Promise<void>;
}
