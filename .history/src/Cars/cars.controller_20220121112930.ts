import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CarService } from './cars.services';
import { OrderMonth } from './dto/ordermount.dto';
import { RezerveCarsDto } from './dto/reservecars.dto'
@ApiTags('cars')
@Controller()
export class CarsController {
    constructor(private readonly carService: CarService) { }
    @Post('order')
    @ApiBody({ type: OrderMonth })
    getorder(@Body() ordermonth: OrderMonth) {
        return this.carService.orderm(ordermonth);
    }
    @Post('check')
    @ApiBody({ type: RezerveCarsDto })
    getHello(@Body() reserveCarsDto: RezerveCarsDto) {
        return this.carService.Getstatus(reserveCarsDto.IDCar, reserveCarsDto.dateStart, reserveCarsDto.dateEnd);
    }
    @Post('reserve')
    @ApiBody({ type: RezerveCarsDto })
    postHello(@Body() reservecarsdto: RezerveCarsDto) {
        //console.log(reservecarsdto)
        return this.carService.Rezervecar(reservecarsdto.IDCar, reservecarsdto.dateStart, reservecarsdto.dateEnd);
    }
}
