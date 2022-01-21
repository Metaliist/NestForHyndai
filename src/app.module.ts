import { Module } from '@nestjs/common';
import { CarsController } from './cars/cars.controller';
import { CarService } from './Cars/cars.service';
import { OrderService } from './Cars/order.service';

@Module({
  imports: [],
  controllers: [CarsController],
  providers: [CarService,OrderService],
})
export class AppModule {}
