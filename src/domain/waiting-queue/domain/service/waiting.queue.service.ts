import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IWaitingQueueRepository } from '../repository/i.waiting.queue.repository';
import { WAITING_QUEUE_REPOSITORY } from 'src/common/const';
import { WaitingQueue } from '../model/waiting.queue';

@Injectable()
export class WaitingQueueService {
  constructor(
    @Inject(WAITING_QUEUE_REPOSITORY)
    private readonly waitingQueueRepository: IWaitingQueueRepository,
  ) {}

  async issueToken(concertId: number): Promise<WaitingQueue> {
    const currentMaxOrder =
      await this.waitingQueueRepository.getMaxQueueOrderForConcert(concertId);
    const queueOrder = currentMaxOrder + 1;

    const waitingQueue = new WaitingQueue({
      concertId,
      queueOrder,
    });

    return await this.waitingQueueRepository.saveQueue(waitingQueue);
  }

  async getQueueByToken(token: string): Promise<WaitingQueue> {
    const queue = await this.waitingQueueRepository.findQueueByToken(token);
    if (!queue) {
      throw new NotFoundException('대기열 토큰을 찾을 수 없습니다.');
    }
    return queue;
  }

  async activateNextQueues(concertId: number): Promise<void> {
    const waitingQueues =
      await this.waitingQueueRepository.getWaitingQueuesForConcert(concertId);

    waitingQueues.forEach((queue) => {
      queue.activate(); // 활성화 후 5분 동안 유효
    });

    await this.waitingQueueRepository.updateQueues(waitingQueues);
  }

  async expireQueues(): Promise<void> {
    const expiredQueues = await this.waitingQueueRepository.findExpiredQueues();
    expiredQueues.forEach((queue) => queue.expire());

    await this.waitingQueueRepository.updateQueues(expiredQueues); // 만료된 상태로 저장
  }
}
