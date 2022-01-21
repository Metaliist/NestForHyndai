import { Module } from '@nestjs/common';
import { CarsController } from './cars/cars.controller';
import { CarService } from './cars/cars.service';
import { OrderService } from './cars/order.service';
import { WTableService } from './cars/wtable.service';

@Module({
  imports: [],
  controllers: [CarsController],
  providers: [CarService, OrderService, WTableService],
})
export class AppModule { }
