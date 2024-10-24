import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { IPaymentRepository } from '../repository/i.payment.repository';
import { PAYMENT_REPOSITORY } from 'src/common/const';
import { Payment } from '../model/payment';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepo: IPaymentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PAYMENT_REPOSITORY,
          useValue: {
            savePayment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepo = module.get<IPaymentRepository>(PAYMENT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processPayment', () => {
    it('결제 처리 후 결제 정보를 저장한다', async () => {
      const reservationId = 1;
      const userId = 1;
      const amount = 5000;

      const payment = new Payment({ reservationId, userId, amount });

      jest.spyOn(paymentRepo, 'savePayment').mockResolvedValue(payment);

      await service.processPayment(reservationId, userId, amount);

      expect(paymentRepo.savePayment).toHaveBeenCalledTimes(1);
      expect(paymentRepo.savePayment).toHaveBeenCalledWith(
        expect.objectContaining({
          reservationId,
          userId,
          amount,
        }),
      );
    });
  });
});
