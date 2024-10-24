import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConcertFacade } from '../application/concert.facade';
import {
  GetAvailableDatesDto,
  GetAvailableSeatsDto,
} from './dto/req/concert.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReserveSeatDto } from './dto/req/reservation.dto';

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
