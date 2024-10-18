import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReserveSeatDto {
  @ApiProperty({
    description: '유저 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: '콘서트 날짜 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  concertDateId: number;

  @ApiProperty({
    description: '좌석 ID',
    example: 15,
  })
  @IsNotEmpty()
  @IsNumber()
  seatId: number;
}
