import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WaitingQueueFacade } from '../application/waiting.queue.facade';

@Injectable()
export class WaitingQueueScheduler {
  constructor(private readonly waitingQueueFacade: WaitingQueueFacade) {}

  // 1분마다 50명씩 대기열 활성화
  @Cron('*/1 * * * *')
  async handleQueueActivation() {
    const concertId = 1; //TODO 수정
    await this.waitingQueueFacade.activateNextQueues(concertId);
  }

  // 1분마다 만료된 토큰을 처리
  @Cron('*/1 * * * *')
  async handleExpiredQueues() {
    await this.waitingQueueFacade.expireQueues();
  }
}
