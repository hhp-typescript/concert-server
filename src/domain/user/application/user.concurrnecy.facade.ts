import { Injectable } from '@nestjs/common';
import { UserConcurrencyService } from '../domain/service/user.concurrency.service';

@Injectable()
export class UserConcurrencyFacade {
  constructor(
    private readonly userConcurrencyService: UserConcurrencyService,
  ) {}

  async chargePointWithPessimistic(userId: number, amount: number) {
    await this.userConcurrencyService.chargePointWithPessimistic(
      userId,
      amount,
    );
  }
}
