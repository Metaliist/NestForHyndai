import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CarService } from './cars.service';
import { OrderMonth } from './dto/order-month.dto';
import { ReserveCarsDto as ReserveCarsDto } from './dto/reservecars.dto';
import { OrderService } from './order.service';
@ApiTags('cars')
@Controller()
export class CarsController {
  constructor(
    private readonly carService: CarService,
    private readonly orderService: OrderService,
  ) {}

  @Post('order')
  @ApiBody({ type: OrderMonth })
  getOrder(@Body() ordermonth: OrderMonth) {
    return this.orderService.orderM(ordermonth);
  }
  @Post('check')
  @ApiBody({ type: ReserveCarsDto })
  getHello(@Body() reserveCarsDto: ReserveCarsDto) {
    return this.carService.getStatus(
      reserveCarsDto.idCar,
      reserveCarsDto.dateStart,
      reserveCarsDto.dateEnd,
    );
  }
  @Post('reserve')
  @ApiBody({ type: ReserveCarsDto })
  postHello(@Body() reserveCarsDto: ReserveCarsDto) {
    //console.log(reservecarsdto)
    return this.carService.reserveCar(
      reserveCarsDto.idCar,
      reserveCarsDto.dateStart,
      reserveCarsDto.dateEnd,
    );
  }
}
