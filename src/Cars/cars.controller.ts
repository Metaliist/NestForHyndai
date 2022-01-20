import { Body, Controller, Get, Post } from '@nestjs/common';
import { CarService } from './cars.services';
import { OrderMonth } from './dto/ordermount.dto';
import { RezerveCarsDto } from './dto/reservecars.dto'

@Controller()
export class CarsController {
    constructor(private readonly carService: CarService) { }
    @Get('order')
    getorder(@Body() ordermonth : OrderMonth){
        return this.carService.orderm(ordermonth);
    }
    @Get()
    getHello(@Body() reservecarsdto: RezerveCarsDto) {
        return this.carService.Getstatus(reservecarsdto.IDCar, reservecarsdto.DateStart, reservecarsdto.DateEnd);
    }
    @Post()
    postHello(@Body() reservecarsdto: RezerveCarsDto) {
        //console.log(reservecarsdto)
        return this.carService.Rezervecar(reservecarsdto.IDCar, reservecarsdto.DateStart, reservecarsdto.DateEnd);
    }
}
