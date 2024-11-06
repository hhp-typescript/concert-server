import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UserConcurrencyFacade } from '../../application/user.concurrnecy.facade';

describe('UserConcurrencyFacade (Integration)', () => {
  let app: INestApplication;
  let facade: UserConcurrencyFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    facade = module.get<UserConcurrencyFacade>(UserConcurrencyFacade);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('동시에 여러 유저가 포인트를 충전하려고 할 때, 모든 요청이 성공해야 한다', async () => {
    const userId = 1;
    const amount = 10000;
    const chargeRequests = Array.from({ length: 10 }, () =>
      facade.chargePointWithPessimistic(userId, amount),
    );

    // 모든 충전 요청이 성공할 것으로 기대
    const results = await Promise.allSettled(chargeRequests);

    // 모든 요청이 fulfilled 상태여야 함
    const successfulCharges = results.filter(
      (result) => result.status === 'fulfilled',
    );
    const failedCharges = results.filter(
      (result) => result.status === 'rejected',
    );

    // 모든 충전이 성공했는지 확인
    expect(successfulCharges.length).toBe(chargeRequests.length);
    expect(failedCharges.length).toBe(0);
  });
});
