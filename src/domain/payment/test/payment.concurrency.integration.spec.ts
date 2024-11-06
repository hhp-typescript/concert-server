import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PaymentFacade } from '../application/payment.facade';

describe('PaymentFacade Integration Test', () => {
  let app: INestApplication;
  let facade: PaymentFacade;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    facade = moduleFixture.get<PaymentFacade>(PaymentFacade);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('payment', () => {
    it('동시에 여러 요청이 동일한 예약을 결제하려고 할 때, 하나만 성공하고 나머지는 낙관적 락 충돌로 실패해야 한다', async () => {
      //given
      const reservationId = 1;
      const userId = 1;
      const amount = 1000;

      // Promise.allSettled로 동시에 여러 결제 요청 보내기
      const concurrencyRequests = Array(10)
        .fill(null)
        .map(() =>
          facade.payment(reservationId, userId, amount).catch((e) => e),
        );

      //when
      const results = await Promise.allSettled(concurrencyRequests);

      // 성공한 요청 필터링
      const successfulRequests = results.filter(
        (result) => result.status === 'fulfilled',
      );
      const failedRequests = results.filter(
        (result) =>
          result.status === 'rejected' &&
          result.reason &&
          result.reason.message ===
            '다른 결제가 이미 처리되었습니다. 다시 시도해주세요.',
      );

      //then
      expect(successfulRequests.length).toBe(1);
      expect(failedRequests.length).toBe(9);
    });
  });
});
