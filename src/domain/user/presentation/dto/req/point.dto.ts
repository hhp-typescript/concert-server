import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class GetPointDto {
  @ApiProperty({
    description: '유저 아이디',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  userId: number;
}

export class ChargetPointDto {
  @ApiProperty({
    description: '유저 아이디',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 1000,
    description: '충전할 포인트',
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1, { message: '충전할 포인트는 최소 1 이상이어야 합니다.' })
  amount: number;
}
