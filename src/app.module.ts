import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './domain/user/user.module';
import { ConcertModule } from './domain/concert/concert.module';
import { WaitingQueueModule } from './domain/waiting-queue/waiting-queue.module';
import { PaymentModule } from './domain/payment/payment.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    ConcertModule,
    WaitingQueueModule,
    PaymentModule,
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
