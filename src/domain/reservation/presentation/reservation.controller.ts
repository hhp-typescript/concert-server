import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReservationFacade } from '../application';

@ApiTags('Reservation')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationFacade: ReservationFacade) {}

  @ApiOperation({ summary: 'user가 예약한 좌석 조회' })
  @Get('/:userId')
  async getRservationByUserId(@Param('userId') userId: number) {
    return await this.reservationFacade.getReservationByUserId(userId);
  }
}
