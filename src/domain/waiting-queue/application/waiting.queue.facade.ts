import { Injectable } from '@nestjs/common';
import { WaitingQueueService } from '../domain';

@Injectable()
export class WaitingQueueFacade {
  constructor(private readonly waitingQueueService: WaitingQueueService) {}

  async issueToken(concertId: number) {
    return await this.waitingQueueService.issueToken(concertId);
  }

  async getQueueStatus(token: string) {
    return await this.waitingQueueService.getQueueByToken(token);
  }

  async activateNextQueues(concertId: number) {
    await this.waitingQueueService.activateNextQueues(concertId);
  }

  async expireQueues() {
    await this.waitingQueueService.expireQueues();
  }
}
