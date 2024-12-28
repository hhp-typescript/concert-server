import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppService } from './app.service';
import { LoggingInterceptor } from './common/presentation';
import { DatabaseModule, RedisModule } from './core';
import { ConcertModule } from './domain/concert/concert.module';
import { PaymentModule } from './domain/payment/payment.module';
import { ReservationModule } from './domain/reservation/reservation.module';
import { UserModule } from './domain/user/user.module';
import { WaitingQueueModule } from './domain/waiting-queue/waiting.queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,

    UserModule,
    ConcertModule,
    WaitingQueueModule,
    PaymentModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
