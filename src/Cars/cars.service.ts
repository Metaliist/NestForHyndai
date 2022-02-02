import { Injectable } from '@nestjs/common';
import { Car } from './cars';
import { pool } from './connectDB'
import { req as Requests } from './Request'
import { WTableService } from './wtable.service';
@Injectable()
export class CarService {

    private readonly car: Car = new Car(0, 0, new Date('2022-01-01'), new Date('2022-01-03'));
    constructor(private readonly wTableService: WTableService) { }
    //The method makes select records from the table and if there is a record, then there is a session, and the car is busy
    private async checkCar(idCar: number, dateStart: Date, dateEnd: Date): Promise<{ err: boolean; errText: string; reserve: boolean; }> {

        const res = await pool
            .query(Requests.find(e => e.req == 'Check car'), [idCar, dateStart, dateEnd])
        if (Object.values(res.rows[0])[0] == 0) {
            return { err: false, errText: '', reserve: false }
        }
        return { err: false, errText: '', reserve: true }

    }
    //The method reserves the car, makes an insert if the car is not occupied and the session satisfies the conditions
    async reserveCar(idCar: number, dateStart: Date, dateEnd: Date): Promise<string> {
        if (!this.wTableService.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        console.log(idCar)
        console.log(typeof idCar)
        if (dateStart < dateEnd) {
            if ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000) > 30) {
                return "It is not possible to reserve for more than 30 days";
            }
            if (dateStart.getDay() > 0 && dateStart.getDay() < 6) {
                let Price: number;
                await this.calcPrise(dateStart, dateEnd).then(price => {
                    Price = price;
                });
                if (!await this.getStatusCar(idCar, dateStart, dateEnd)) {
                    if (await this.reserved(idCar, dateStart, dateEnd, Price)) {
                        return 'I have reserved a car, everything is fine.Rental price: ' + Price;
                    }
                }
                return 'The car has already been reserved, choose another car or dates.';
            }
            return 'The beginning or end of the lease should fall on weekdays';
        }
        return 'Dates are not correctly selected';
    }
    //Method for insert to table
    private async reserved(idCar: number, dateStart: Date, dateEnd: Date, price: number): Promise<boolean> {
        const res = await pool
            .query(Requests.find(e => e.req == 'Reserve car'), [idCar, dateStart, dateEnd, price])
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
        if (res) { return true }
        return false;
    }
    //Method for getting the status of the car, reserved or not
    async getStatus(idCar: number, dateStart: Date, dateEnd: Date): Promise<string> {
        if (!this.wTableService.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        let price: number = 0;
        if (dateStart < dateEnd) {
            if ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000) > 30) {
                return "It is not possible to reserve for more than 30 days";
            }
            if (dateStart.getDay() > 0 && dateStart.getDay() < 6) {
                price = await this.calcPrise(dateStart, dateEnd);
                let res = await this.getStatusCar(idCar, dateStart, dateEnd);
                if (res) {
                    return "Reserve";
                }
                return "Not Reserve. Rental price: " + price;
            }
            return 'The beginning or end of the lease should fall on weekdays';
        }
        return 'Dates are not correctly selected';
    }
    //The upper method for checking the status
    private async getStatusCar(idCar: number, dateStart: Date, dateEnd: Date): Promise<boolean> {

        await this.wTableService.checkTable()
            .catch(err => { throw new Error(err); });
        await this.wTableService.checkTablePrice().catch(err => { throw new Error(err); });
        let res: boolean = (await this.checkCar(idCar, dateStart, dateEnd)).reserve;
        console.log(res)
        return res;
    }
    //Method for calculating rental days
    private async calcPrise(dateStart: Date, dateEnd: Date): Promise<number> {
        let day: number = ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000));
        return await this.sumPrice(day);

    }
    //Method for calculating the rental cost
    private async sumPrice(countDay: number): Promise<number> {
        const res = await pool
            .query(Requests.find(e => e.req == 'Sum Price'), [countDay])
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
        return res.rows[0].sum;
    }
    //Method for converting a date from a string or from a number
}