import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UserFacade } from '../../application/user.facade';

describe('UserFacade (Integration)', () => {
  let app: INestApplication;
  let facade: UserFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    facade = module.get<UserFacade>(UserFacade);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  it('동시에 여러번 포인트 충전 시, 모든 요청이 반영된다', async () => {
    const userId = 1;
    const chargeAmount = 1000;
    const concurrentRequests = 5;

    const initialUser = await facade.getPoint(userId);
    const initialPoint = initialUser.point;

    const promises = Array(concurrentRequests)
      .fill(null)
      .map(() => facade.chargePoint(userId, chargeAmount));

    await Promise.all(promises);

    const updatedUser = await facade.getPoint(userId);
    const updatedPoint = updatedUser.point;

    const expectedPoint =
      initialPoint.balance + chargeAmount * concurrentRequests;
    expect(updatedPoint).toBe(expectedPoint);
  }, 100000);
});
