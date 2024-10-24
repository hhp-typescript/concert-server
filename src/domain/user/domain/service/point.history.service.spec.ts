import { Test, TestingModule } from '@nestjs/testing';
import { IPointHistoryRepository } from '../repository';
import { POINT_HISTORY_REPOSITORY } from 'src/common/const';
import { DataSource, QueryRunner } from 'typeorm';
import { PointHistoryService } from './point.history.service';

describe('PointHistoryService', () => {
  let service: PointHistoryService;
  let pointHistoryRepo: IPointHistoryRepository;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    } as unknown as QueryRunner;

    const dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointHistoryService,
        {
          provide: DataSource,
          useValue: dataSource,
        },
        {
          provide: POINT_HISTORY_REPOSITORY,
          useValue: {
            LogHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PointHistoryService>(PointHistoryService);
    pointHistoryRepo = module.get<IPointHistoryRepository>(
      POINT_HISTORY_REPOSITORY,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logCharge', () => {
    it('포인트 충전 내역을 기록한다', async () => {
      const userId = 1;
      const amount = 1000;

      jest.spyOn(pointHistoryRepo, 'LogHistory');

      await service.logCharge(userId, amount);

      expect(pointHistoryRepo.LogHistory).toHaveBeenCalledTimes(1);
      expect(pointHistoryRepo.LogHistory).toHaveBeenCalledWith(
        expect.objectContaining({ userId }),
      );
    });
  });

  describe('logUsage', () => {
    it('포인트 사용 내역을 기록한다', async () => {
      const userId = 1;
      const amount = 500;

      jest.spyOn(pointHistoryRepo, 'LogHistory');

      await service.logUsage(userId, amount);

      expect(pointHistoryRepo.LogHistory).toHaveBeenCalledTimes(1);
      expect(pointHistoryRepo.LogHistory).toHaveBeenCalledWith(
        expect.objectContaining({ userId }),
      );
    });
  });
});
