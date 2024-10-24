import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserFacade } from '../application/user.facade';
import { ChargetPointDto, GetPointDto } from './dto/req';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

//TODO:response추가.
//TODO exception filter 추가
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
