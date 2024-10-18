import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserRepository } from '../repository/i.user.repository';
import { IPointRepository } from '../repository';
import { POINT_REPOSITORY, USER_REPOSITORY } from 'src/common/const';
import { User } from '../model/user';
import { Point } from '../model/point';
import { DataSource, QueryRunner } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepo: IUserRepository;
  let pointHistoryRepo: IPointRepository;
  let queryRunner: QueryRunner;
  let dataSource: DataSource;

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

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DataSource,
          useValue: dataSource,
        },
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: POINT_REPOSITORY,
          useValue: {
            getPointByUserId: jest.fn(),
            savePoint: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(USER_REPOSITORY);
    pointHistoryRepo = module.get(POINT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('유저가 존재할 때 유저를 반환한다', async () => {
      const userId = 1;
      const user = new User({
        id: userId,
        name: 'Test User',
        point: new Point({ id: 1, balance: 1000 }),
      });
      jest.spyOn(userRepo, 'getUserById').mockResolvedValue(user);

      const result = await service.getUserById(userId);

      expect(result).toEqual(user);
    });

    it('유저가 존재하지 않을 때 NotFoundException을 던진다', async () => {
      const userId = 1;
      jest.spyOn(userRepo, 'getUserById').mockResolvedValue(null);

      await expect(service.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepo.getUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('chargePoint', () => {
    it('유저가 존재할 때 포인트를 충전하고 저장한다', async () => {
      const userId = 1;
      const amount = 1000;
      const userPoint = new Point({ id: 1, balance: 500 });
      jest
        .spyOn(pointHistoryRepo, 'getPointByUserId')
        .mockResolvedValue(userPoint);
      jest.spyOn(pointHistoryRepo, 'savePoint').mockResolvedValue(userPoint);

      const result = await service.chargePoint(userId, amount);

      expect(userPoint.balance).toBe(1500); // 충전된 후의 포인트 잔액 확인
      expect(result).toEqual(userPoint);
      expect(pointHistoryRepo.getPointByUserId).toHaveBeenCalledWith(userId);
      expect(pointHistoryRepo.savePoint).toHaveBeenCalledWith(userPoint);
    });

    it('유저가 존재하지 않을 때 NotFoundException을 던진다', async () => {
      const userId = 1;
      const amount = 1000;
      jest.spyOn(pointHistoryRepo, 'getPointByUserId').mockResolvedValue(null);

      await expect(service.chargePoint(userId, amount)).rejects.toThrow(
        NotFoundException,
      );
      expect(pointHistoryRepo.getPointByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('usePoint', () => {
    it('유저가 존재할 때 포인트를 사용하고 저장한다', async () => {
      const userId = 1;
      const amount = 500;
      const userPoint = new Point({ id: 1, balance: 1000 });
      jest
        .spyOn(pointHistoryRepo, 'getPointByUserId')
        .mockResolvedValue(userPoint);
      jest.spyOn(pointHistoryRepo, 'savePoint').mockResolvedValue(userPoint);

      const result = await service.usePoint(userId, amount);

      expect(userPoint.balance).toBe(500); // 포인트 차감 후 잔액 확인
      expect(result).toEqual(userPoint);
      expect(pointHistoryRepo.getPointByUserId).toHaveBeenCalledWith(userId);
      expect(pointHistoryRepo.savePoint).toHaveBeenCalledWith(userPoint);
    });

    it('유저가 존재하지 않을 때 NotFoundException을 던진다', async () => {
      const userId = 1;
      const amount = 500;
      jest.spyOn(pointHistoryRepo, 'getPointByUserId').mockResolvedValue(null);

      await expect(service.usePoint(userId, amount)).rejects.toThrow(
        NotFoundException,
      );
      expect(pointHistoryRepo.getPointByUserId).toHaveBeenCalledWith(userId);
    });
  });
});
