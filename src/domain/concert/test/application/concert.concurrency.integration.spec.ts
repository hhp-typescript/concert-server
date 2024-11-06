import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ConcertConcurrencyFacade } from '../../application/concert.concurrency.facade';

describe('ConcertFacade (Integration)', () => {
  let app: INestApplication;
  let facade: ConcertConcurrencyFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    facade = module.get<ConcertConcurrencyFacade>(ConcertConcurrencyFacade);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('동시에 여러 유저가 같은 좌석을 예약하려고 할 때, 하나만 성공하고 나머지는 실패해야 한다', async () => {
    //given
    const concertDateId = 1;
    const seatId = 1;
    const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const reservationPromises = userIds.map((userId) =>
      facade.reserveWithOptimistic(concertDateId, seatId, userId),
    );

    //when
    const results = await Promise.allSettled(reservationPromises);

    const successfulReservations = results.filter(
      (result) => result.status === 'fulfilled',
    );
    const failedReservations = results.filter(
      (result) => result.status === 'rejected',
    );

    //then
    expect(successfulReservations.length).toBe(1);
    expect(failedReservations.length).toBe(userIds.length - 1);
  });
});
