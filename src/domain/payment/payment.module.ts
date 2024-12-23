import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from 'src/common/const';
import { PaymentRepositoryImpl } from './infrastructure/repository/payment.repository.impl';
import { PaymentService } from './domain/service/payment.service';
import { UserModule } from '../user/user.module';
import { ConcertModule } from '../concert/concert.module';
import { WaitingQueueModule } from '../waiting-queue/waiting-queue.module';
import { PaymentController } from './presentation/payment.controller';

@Module({
  imports: [UserModule, ConcertModule, WaitingQueueModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepositoryImpl },
  ],
})
export class PaymentModule {}
