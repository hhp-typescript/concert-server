import { Controller, UseInterceptors, Get, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/presentation';
import { UserFacade, UserConcurrencyFacade } from '../application';
import { User } from '../domain';
import { GetPointDto, ChargetPointDto } from './dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @ApiOperation({ summary: '포인트 조회' })
  @Get('point')
  async getPoint(@Body() dto: GetPointDto) {
    return await this.userFacade.getPoint(dto.userId);
  }

  @ApiOperation({ summary: '포인트 충전' })
  @Post('point')
  async chargePoint(@Body() dto: ChargetPointDto) {
    this.userFacade.chargePoint(dto.userId, dto.amount);
  }
}
