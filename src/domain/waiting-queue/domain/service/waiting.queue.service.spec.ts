import { WAITING_QUEUE_REPOSITORY } from 'src/common/const';
import { WaitingQueue, WaitingQueueStatus } from '../model/waiting.queue';
import { IWaitingQueueRepository } from '../repository/i.waiting.queue.repository';
import { WaitingQueueService } from './waiting.queue.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('WaitingQueueService', () => {
  let service: WaitingQueueService;
  let waitingQueueRepo: IWaitingQueueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitingQueueService,
        {
          provide: WAITING_QUEUE_REPOSITORY,
          useValue: {
            getMaxQueueOrderForConcert: jest.fn(),
            saveQueue: jest.fn(),
            findQueueByToken: jest.fn(),
            getWaitingQueuesForConcert: jest.fn(),
            findExpiredQueues: jest.fn(),
            updateQueues: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WaitingQueueService>(WaitingQueueService);
    waitingQueueRepo = module.get<IWaitingQueueRepository>(
      WAITING_QUEUE_REPOSITORY,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('issueToken', () => {
    it('대기열 토큰을 발급하고 저장한다', async () => {
      const concertId = 1;
      const maxOrder = 5;

      jest
        .spyOn(waitingQueueRepo, 'getMaxQueueOrderForConcert')
        .mockResolvedValue(maxOrder);
      const waitingQueue = new WaitingQueue({
        concertId,
        queueOrder: maxOrder + 1,
        token: 'sample-token',
      });
      jest.spyOn(waitingQueueRepo, 'saveQueue').mockResolvedValue(waitingQueue);

      const result = await service.issueToken(concertId);

      expect(result).toEqual(waitingQueue);
      expect(waitingQueueRepo.getMaxQueueOrderForConcert).toHaveBeenCalledWith(
        concertId,
      );
      expect(waitingQueueRepo.saveQueue).toHaveBeenCalledWith(waitingQueue);
    });
  });

  describe('getQueueByToken', () => {
    it('유효한 토큰으로 대기열을 반환한다', async () => {
      const token = 'test-token';
      const waitingQueue = new WaitingQueue({
        concertId: 1,
        queueOrder: 1,
        token, // 추가
      });

      jest
        .spyOn(waitingQueueRepo, 'findQueueByToken')
        .mockResolvedValue(waitingQueue);

      const result = await service.getQueueByToken(token);

      expect(result).toEqual(waitingQueue);
      expect(waitingQueueRepo.findQueueByToken).toHaveBeenCalledWith(token);
    });

    it('유효하지 않은 토큰일 경우 NotFoundException을 던진다', async () => {
      const token = 'invalid-token';

      jest.spyOn(waitingQueueRepo, 'findQueueByToken').mockResolvedValue(null);

      await expect(service.getQueueByToken(token)).rejects.toThrow(
        NotFoundException,
      );
      expect(waitingQueueRepo.findQueueByToken).toHaveBeenCalledWith(token);
    });
  });

  describe('activateNextQueues', () => {
    it('대기열을 활성화하고 업데이트한다', async () => {
      const concertId = 1;
      const waitingQueues = [
        new WaitingQueue({
          concertId,
          queueOrder: 1,
          status: WaitingQueueStatus.WAITING,
          token: 'sample-token-1', // 추가
        }),
        new WaitingQueue({
          concertId,
          queueOrder: 2,
          status: WaitingQueueStatus.WAITING,
          token: 'sample-token-2', // 추가
        }),
      ];

      jest
        .spyOn(waitingQueueRepo, 'getWaitingQueuesForConcert')
        .mockResolvedValue(waitingQueues);
      jest.spyOn(waitingQueueRepo, 'updateQueues').mockResolvedValue();

      await service.activateNextQueues(concertId);

      waitingQueues.forEach((queue) => {
        expect(queue.status).toBe(WaitingQueueStatus.ACTIVE);
      });

      expect(waitingQueueRepo.getWaitingQueuesForConcert).toHaveBeenCalledWith(
        concertId,
      );
      expect(waitingQueueRepo.updateQueues).toHaveBeenCalledWith(waitingQueues);
    });
  });

  describe('expireQueues', () => {
    it('만료된 대기열을 처리하고 업데이트한다', async () => {
      const expiredQueues = [
        new WaitingQueue({
          concertId: 1,
          queueOrder: 1,
          status: WaitingQueueStatus.ACTIVE,
          token: 'sample-token-3', // 추가
        }),
      ];

      jest
        .spyOn(waitingQueueRepo, 'findExpiredQueues')
        .mockResolvedValue(expiredQueues);
      jest.spyOn(waitingQueueRepo, 'updateQueues').mockResolvedValue();

      await service.expireQueues();

      expiredQueues.forEach((queue) => {
        expect(queue.status).toBe(WaitingQueueStatus.EXPIRED);
      });

      expect(waitingQueueRepo.findExpiredQueues).toHaveBeenCalledTimes(1);
      expect(waitingQueueRepo.updateQueues).toHaveBeenCalledWith(expiredQueues);
    });
  });
});
