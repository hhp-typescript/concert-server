import { Controller, Post, Body } from '@nestjs/common';
import { PaymentFacade } from '../application/payment.facade';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentDto } from './dto/req/payment.dto';

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentFacade: PaymentFacade) {}

  @ApiOperation({ summary: '결제 처리' })
  @Post()
  async processPayment(@Body() dto: PaymentDto) {
    await this.paymentFacade.processPayment(
      dto.reservationId,
      dto.userId,
      dto.amount,
    );
  }
}
