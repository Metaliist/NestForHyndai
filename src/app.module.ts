import { Module } from '@nestjs/common';
import { Car } from './Cars/cars';
import { CarsController } from './cars/cars.controller';
import { CarService } from './cars/cars.service';
import { OrderService } from './cars/order.service';
import { WTableService } from './cars/w-table.service';

@Module({
  imports: [],
  controllers: [CarsController],
  providers: [CarService, OrderService, WTableService, Car],
})
export class AppModule {}
