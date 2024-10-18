import { Controller, Post, Param, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WaitingQueueFacade } from '../application/waiting.queue.facade';

@ApiTags('WaitingQueue')
@Controller('waiting-queue')
export class WaitingQueueController {
  constructor(private readonly waitingQueueFacade: WaitingQueueFacade) {}

  @ApiOperation({ summary: '대기열 토큰 발급' })
  @Post('issue/:concertId')
  async issueToken(@Param('concertId') concertId: number) {
    return await this.waitingQueueFacade.issueToken(concertId);
  }

  @ApiOperation({ summary: '대기열 토큰 조회' })
  @Get('status/:token')
  async getQueueStatus(@Param('token') token: string) {
    return await this.waitingQueueFacade.getQueueStatus(token);
  }
}
