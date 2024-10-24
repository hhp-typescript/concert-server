import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ConcertFacade } from '../../application/concert.facade';

describe('ConcertFacade (Integration)', () => {
  let app: INestApplication;
  let facade: ConcertFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    facade = module.get<ConcertFacade>(ConcertFacade);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  it('동시에 여러 유저가 같은 좌석을 예약하려고 할 때, 하나만 성공하고 나머지는 실패해야 한다', async () => {
    const concertDateId = 1;
    const seatId = 1;
    const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Promise.all을 이용해 병렬로 예약 시도
    const reservationPromises = userIds.map((userId) =>
      facade.reserveSeat(concertDateId, seatId, userId),
    );

    const results = await Promise.all(
      reservationPromises.map((p) => p.catch((e) => e)),
    );

    // 성공한 요청은 하나여야 함
    const successfulReservations = results.filter(
      (result) => result && result.id,
    );
    const failedReservations = results.filter(
      (result) => result instanceof Error,
    );

    expect(successfulReservations.length).toBe(1);
    expect(failedReservations.length).toBe(userIds.length - 1);
  });
});
