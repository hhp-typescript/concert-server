import { Injectable, Inject } from '@nestjs/common';
import { WAITING_QUEUE_REPOSITORY } from 'src/common/application';
import {
  InternalServerErrorException,
  NotFoundException,
} from 'src/common/domain';
import { WaitingQueue } from '../model';
import { IWaitingQueueRepository } from '../repository';

@Injectable()
export class WaitingQueueService {
  constructor(
    @Inject(WAITING_QUEUE_REPOSITORY)
    private readonly waitingQueueRepository: IWaitingQueueRepository,
  ) {}

  // 대기열에 새로운 토큰 추가
  async issueToken(concertDateId: number) {
    // Redis를 사용해 대기열 토큰을 발급하고, 해당 토큰의 순번을 조회합니다.
    const token = await this.waitingQueueRepository.issueToken(concertDateId);

    if (!token)
      //TODO 토큰 발급 안됐을때  어떤 에러던질까?
      return token;
  }

  // 대기열의 토큰 활성화
  async activateTokens(concertDateId: number, count: number): Promise<void> {
    await this.waitingQueueRepository.activateTokens(concertDateId, count);
  }

  async getTokenStatus(
    concertDateId: number,
    token: string,
  ): Promise<{ position: number | null; isActive: boolean }> {
    //TODO 대기 시간 추가
    const position = await this.waitingQueueRepository.getWaitingTokenRank(
      concertDateId,
      token,
    );
    if (position) {
      return { position, isActive: false };
    }

    const isActive = await this.waitingQueueRepository.isTokenActive(
      concertDateId,
      token,
    );

    if (isActive) {
      return { position: null, isActive: true };
    }

    // 토큰이 없으면 NotFoundException 발생
    throw new NotFoundException(
      'waiting-queue',
      '해당 토큰이 존재하지 않습니다.',
    );
  }
  // 토큰 삭제
  async deleteToken(concertDateId: number, token: string) {
    await this.waitingQueueRepository.deleteToken(concertDateId, token);
  }
  // async issueToken(concertId: number): Promise<WaitingQueue> {
  //   const currentMaxOrder =
  //     await this.waitingQueueRepository.getMaxQueueOrderForConcert(concertId);
  //   const queueOrder = currentMaxOrder + 1;

  //   const waitingQueue = new WaitingQueue({
  //     concertId,
  //     queueOrder,
  //   });

  //   return await this.waitingQueueRepository.saveQueue(waitingQueue);
  // }

  async getQueueByToken(token: string): Promise<WaitingQueue> {
    const queue = await this.waitingQueueRepository.findQueueByToken(token);
    if (!queue) {
      // throw new NotFoundException('대기열 토큰을 찾을 수 없습니다.');
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
