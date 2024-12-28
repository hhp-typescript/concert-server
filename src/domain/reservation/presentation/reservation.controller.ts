import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReservationFacade } from '../application';
import { ReserveSeatDto } from './dto';

@ApiTags('Reservation')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationFacade: ReservationFacade) {}

  @ApiOperation({ summary: '좌석 예약' })
  @Post()
  async reserve(@Body() dto: ReserveSeatDto) {
    return await this.reservationFacade.reserve(
      dto.concertDateId,
      dto.seatId,
      dto.userId,
    );
  }

  @ApiOperation({ summary: 'user가 예약한 좌석 조회' })
  @Get('/:userId')
  async getRservationByUserId(@Param('userId') userId: number) {
    return await this.reservationFacade.getReservationByUserId(userId);
  }
}
