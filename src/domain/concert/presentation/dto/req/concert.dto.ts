import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAvailableSeatsDto {
  @ApiProperty({
    description: '콘서트 날짜 아이디',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  concertDateId: number;
}

export class GetAvailableDatesDto {
  @ApiProperty({
    description: '콘서트 아이디',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  concertId: number;
}
