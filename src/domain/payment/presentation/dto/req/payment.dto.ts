import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaymentDto {
  @ApiProperty({
    description: '예약 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  reservationId: number;

  @ApiProperty({
    description: '유저 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: '결제 금액',
    example: 50000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: '결제 금액은 최소 1 이상이어야 합니다.' })
  amount: number;
}
