import { Injectable } from '@nestjs/common';
import { Car } from './cars';
import { pool } from './connectDB';

import { req as Requests } from './request';
import { WTableService } from './w-table.service';
@Injectable()
export class CarService {
  private readonly car: Car = new Car(
    0,
    0,
    new Date('2022-01-01'),
    new Date('2022-01-03'),
  );
  constructor(private readonly wTableService: WTableService) {}
  //The method makes select records from the table and if there is a record, then there is a session, and the car is busy
  private async checkCar(idCar: number, dateStart: Date, dateEnd: Date) {
    const res = await pool.query(
      Requests.find((e) => e.req == 'Check car'),
      [idCar, dateStart, dateEnd],
    );

    if (Object.values(res.rows[0])[0] == 0) {
      return { err: false, errtext: '', rezerve: false };
    } else {
      return { err: false, errtext: '', rezerve: true };
    }
  }
  //The method reserves the car, makes an insert if the car is not occupied and the session satisfies the conditions
  async reserveCar(idCar: number, dateStart: Date, dateEnd: Date) {
    if (!this.wTableService.checkID(idCar)) {
      return 'The identification car is specified more than there is in the park';
    }
    const d = this.convertDate(dateStart, dateEnd);
    dateStart = d.dateStart;
    dateEnd = d.dateEnd;
    console.log(idCar);
    console.log(typeof idCar);
    if (dateStart < dateEnd) {
      if ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000) > 30) {
        return 'It is not possible to reserve for more than 30 days';
      }
      if (dateStart.getDay() > 0 && dateStart.getDay() < 6) {
        return await this.getStatusCar(idCar, dateStart, dateEnd).then(
          async (res) => {
            let Price: number;
            await this.calcPrise(dateStart, dateEnd).then((price) => {
              Price = price;
            });
            switch (res) {
              case false:
                return await this.reserved(
                  idCar,
                  dateStart,
                  dateEnd,
                  Price,
                ).then((res) => {
                  if (res) {
                    return (
                      'I have reserved a car, everything is fine.Rental price: ' +
                      Price
                    );
                  }
                });
              case true:
                return 'The car has already been reserved, choose another car or dates.';
            }
          },
        );
      } else {
        return 'The beginning or end of the lease should fall on weekdays';
      }
    } else {
      return 'Dates are not correctly selected';
    }
  }
  //Method for insert to table
  private async reserved(
    idCar: number,
    dateStart: Date,
    dateEnd: Date,
    price: number,
  ) {
    return await pool
      .query(
        Requests.find((e) => e.req == 'Rezerve car'),
        [idCar, dateStart, dateEnd, price],
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  }
  //Method for getting the status of the car, reserved or not
  async getStatus(idCar: number, dateStart: Date, dateEnd: Date) {
    if (!this.wTableService.checkID(idCar)) {
      return 'The identification car is specified more than there is in the park';
    }
    const d = this.convertDate(dateStart, dateEnd);
    dateStart = d.dateStart;
    dateEnd = d.dateEnd;
    let price = 0;
    if (dateStart < dateEnd) {
      if ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000) > 30) {
        return 'It is not possible to reserve for more than 30 days';
      }
      if (dateStart.getDay() > 0 && dateStart.getDay() < 6) {
        return await this.getStatusCar(idCar, dateStart, dateEnd).then(
          async (res) => {
            await this.calcPrise(dateStart, dateEnd).then((_price) => {
              price = _price;
            });
            switch (res) {
              case false:
                return 'Not Rezerv. Rental price: ' + price;
              case true:
                return 'Rezerv';
            }
          },
        );
      } else {
        return 'The beginning or end of the lease should fall on weekdays';
      }
    } else {
      return 'Dates are not correctly selected';
    }
  }
  //The upper method for checking the status
  private async getStatusCar(idCar: number, dateStart: Date, dateEnd: Date) {
    await this.wTableService.checkTable().catch((err) => {
      throw new Error(err);
    });
    await this.wTableService.checkTablePrice().catch((err) => {
      throw new Error(err);
    });
    return await this.checkCar(idCar, dateStart, dateEnd).then((res) => {
      return res.rezerve;
    });
  }
  //Method for calculating rental days
  private async calcPrise(dateStart: Date, dateEnd: Date) {
    const day = (+dateEnd - +dateStart) / (60 * 60 * 24 * 1000);
    return await this.sumPrice(day);
  }
  //Method for calculating the rental cost
  private async sumPrice(countday: number) {
    return await pool
      .query(
        Requests.find((e) => e.req == 'Sum Price'),
        [countday],
      )
      .then((res) => {
        return res.rows[0].sum;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  }
  //Method for converting a date from a string or from a number
  private convertDate(dateStart: Date, dateEnd: Date) {
    if (
      typeof dateStart === 'string' ||
      typeof dateStart === 'number' ||
      typeof dateEnd === 'string' ||
      typeof dateEnd === 'number'
    ) {
      dateStart = new Date(dateStart);
      dateEnd = new Date(dateEnd);
    }
    return { dateStart: dateStart, dateEnd: dateEnd };
  }
}
