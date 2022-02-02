import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CarService } from './cars.service';
import { OrderService } from './order.service';
import { OrderMonth } from './dto/order-mount.dto';
import { ReserveCarsDto as ReserveCarsDto } from './dto/reserve-cars.dto'
@ApiTags('cars')
@Controller()
export class CarsController {
    constructor(private readonly carService: CarService, private readonly orderService: OrderService) { }

    @Post('order')
    @ApiBody({ type: OrderMonth })
    getOrder(@Body() orderMonth: OrderMonth) {
        return this.orderService.orderM(orderMonth);
    }
    @Post('check')
    @ApiBody({ type: ReserveCarsDto })
    getHello(@Body() reserveCarsDto: ReserveCarsDto) {
        return this.carService.getStatus(reserveCarsDto.idCar, reserveCarsDto.dateStart, reserveCarsDto.dateEnd);
    }
    @Post('reserve')
    @ApiBody({ type: ReserveCarsDto })
    postHello(@Body() reserveCarsDto: ReserveCarsDto) {

        return this.carService.reserveCar(reserveCarsDto.idCar, reserveCarsDto.dateStart, reserveCarsDto.dateEnd);
    }
}
