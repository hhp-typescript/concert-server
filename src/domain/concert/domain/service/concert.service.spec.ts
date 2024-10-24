import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { IConcertRepository } from '../repository/i.concert.repository';
import { CONCERT_REPOSITORY } from 'src/common/const';
import { NotFoundException } from '@nestjs/common';
import { Concert } from '../model/concert';

describe('ConcertService', () => {
  let service: ConcertService;
  let concertRepo: IConcertRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: CONCERT_REPOSITORY,
          useValue: {
            getConcertByConcertDateId: jest.fn(),
            getConcertById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
    concertRepo = module.get<IConcertRepository>(CONCERT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableSeats', () => {
    it('콘서트가 존재할 때 예약 가능한 좌석을 반환한다', async () => {
      const concertDateId = 1;
      const concert = new Concert({
        id: 1,
        name: 'Test Concert',
        concertDates: [],
      });
      jest
        .spyOn(concertRepo, 'getConcertByConcertDateId')
        .mockResolvedValue(concert);
      jest.spyOn(concert, 'getAvailableSeats').mockImplementation(() => []); // 좌석 정보를 반환하는 메서드 모킹

      const result = await service.getAvailableSeats(concertDateId);

      expect(result).toEqual(concert);
      expect(concertRepo.getConcertByConcertDateId).toHaveBeenCalledWith(
        concertDateId,
      );
      expect(concert.getAvailableSeats).toHaveBeenCalledWith(concertDateId);
    });

    it('콘서트가 존재하지 않을 때 NotFoundException을 던진다', async () => {
      const concertDateId = 1;
      jest
        .spyOn(concertRepo, 'getConcertByConcertDateId')
        .mockResolvedValue(null);

      await expect(service.getAvailableSeats(concertDateId)).rejects.toThrow(
        NotFoundException,
      );
      expect(concertRepo.getConcertByConcertDateId).toHaveBeenCalledWith(
        concertDateId,
      );
    });
  });

  describe('getAvailableDates', () => {
    it('콘서트가 존재할 때 예약 가능한 날짜를 반환한다', async () => {
      const concertId = 1;
      const concert = new Concert({
        id: concertId,
        name: 'Test Concert',
        concertDates: [],
      });
      jest.spyOn(concertRepo, 'getConcertById').mockResolvedValue(concert);
      jest
        .spyOn(concert, 'getAvailableConcertDates')
        .mockImplementation(() => []);

      const result = await service.getAvailableDates(concertId);

      expect(result).toEqual(concert);
      expect(concertRepo.getConcertById).toHaveBeenCalledWith(concertId);
      expect(concert.getAvailableConcertDates).toHaveBeenCalled();
    });

    it('콘서트가 존재하지 않을 때 NotFoundException을 던진다', async () => {
      const concertId = 1;
      jest.spyOn(concertRepo, 'getConcertById').mockResolvedValue(null);

      await expect(service.getAvailableDates(concertId)).rejects.toThrow(
        NotFoundException,
      );
      expect(concertRepo.getConcertById).toHaveBeenCalledWith(concertId);
    });
  });
});
