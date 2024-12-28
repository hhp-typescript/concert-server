import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConcertFacade } from '../application';
import { GetAvailableSeatsDto, GetAvailableDatesDto } from './dto';

@ApiTags('Concert')
@Controller('/concerts')
export class ConcertController {
  constructor(private readonly concertFacade: ConcertFacade) {}

  @ApiOperation({ summary: '예약 가능 좌석 조회' })
  @Get('available-seat')
  async getAvailableSeats(@Body() dto: GetAvailableSeatsDto) {
    return this.concertFacade.getAvailableSeats(dto.concertDateId);
  }

  @ApiOperation({ summary: '예약 가능 날짜 조회' })
  @Get('available-date')
  async getAvailableDates(@Body() dto: GetAvailableDatesDto) {
    return this.concertFacade.getAvailableDates(dto.concertId);
  }
  @ApiOperation({ summary: '좌석 예약' })
  @Post('reserve')
  async reserveSeat(@Body() dto: ReserveSeatDto) {
    return await this.concertFacade.reserveSeat(
      dto.concertDateId,
      dto.seatId,
      dto.userId,
    );
  }
}
