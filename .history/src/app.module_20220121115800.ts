import { Module } from '@nestjs/common';
import { CarsController } from './cars/cars.controller';
import { CarService } from './cars/cars.services';
import { OrderService } from './Cars/order.services';

@Module({
  imports: [],
  controllers: [CarsController],
  providers: [CarService,OrderService],
})
export class AppModule {}
