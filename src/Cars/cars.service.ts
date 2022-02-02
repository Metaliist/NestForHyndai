import { Injectable } from '@nestjs/common';
import { Car } from './cars';
import { pool as client } from './connectDB'
client.connect();
import { req as Requests } from './Request'
import { WTableService } from './wtable.service';
@Injectable()
export class CarService {
    
    private readonly car: Car = new Car(0, 0, new Date('2022-01-01'), new Date('2022-01-03'));
    constructor(private readonly wtableService: WTableService) { }
    //The method makes select records from the table and if there is a record, then there is a session, and the car is busy
    private async checkCar(idCar: number, dateStart: Date, dateEnd: Date) {

        let res = await client
            .query(Requests.find(e => e.req == 'Check car'), [idCar, dateStart, dateEnd])
        if (Object.values(res.rows[0])[0] == 0) {
            return { err: false, errtext: '', reserve: false }
        }
        return { err: false, errtext: '', rezerve: true }

    }
    //The method reserves the car, makes an insert if the car is not occupied and the session satisfies the conditions
    async rezerveCar(idCar: number, dateStart: Date, dateEnd: Date) {
        if (!this.wtableService.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        console.log(idCar)
        console.log(typeof idCar)
        if (dateStart < dateEnd) {
            if ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000) > 30) {
                return "It is not possible to reserve for more than 30 days";
            }
            if (dateStart.getDay() > 0 && dateStart.getDay() < 6) {
                return await this.getStatusCar(idCar, dateStart, dateEnd).then(async res => {
                    let Price: number;
                    await this.calcPrise(dateStart, dateEnd).then(price => {
                        Price = price;
                    });
                    if (res) {
                        return await this.rezerved(idCar, dateStart, dateEnd, Price).then((_res) => {
                            if (_res) {
                                return 'I have reserved a car, everything is fine.Rental price: ' + Price;
                            }
                        });
                    }
                    return 'The car has already been reserved, choose another car or dates.';
                });
            }
            return 'The beginning or end of the lease should fall on weekdays';
        }
        return 'Dates are not correctly selected';
    }
    //Method for insert to table
    private async rezerved(idCar: number, dateStart: Date, dateEnd: Date, price: number) {
        return await client
            .query(Requests.find(e => e.req == 'Rezerve car'), [idCar, dateStart, dateEnd, price])
            .then(() => {
                return true;
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
    }
    //Method for getting the status of the car, reserved or not
    async getStatus(idCar: number, dateStart: Date, dateEnd: Date) {
        if (!this.wtableService.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        let price: number = 0;
        if (dateStart < dateEnd) {
            if ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000) > 30) {
                return "It is not possible to reserve for more than 30 days";
            }
            if (dateStart.getDay() > 0 && dateStart.getDay() < 6) {
                
                let res = await this.getStatusCar(idCar, dateStart, dateEnd).then(async res => {
                    await this.calcPrise(dateStart, dateEnd).then(_price => {
                        price = _price;
                    });
                    await client.end();
                    if (res) {
                        return "Rezerv";
                    }
                    return "Not Rezerv. Rental price: " + price;
                });
                await client.end();
                return res;
            }
            return 'The beginning or end of the lease should fall on weekdays';
        }
        return 'Dates are not correctly selected';
    }
    //The upper method for checking the status
    private async getStatusCar(idCar: number, dateStart: Date, dateEnd: Date) : Promise<boolean> {

        await this.wtableService.checkTable()
            .catch(err => { throw new Error(err); });
        await this.wtableService.checkTablePrice().catch(err => { throw new Error(err); });
        let res: boolean = (await this.checkCar(idCar, dateStart, dateEnd)).reserve;
        return res;
    }
    //Method for calculating rental daysы
    private async calcPrise(dateStart: Date, dateEnd: Date) {
        let day: number = ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000));
        return await this.sumPrice(day);

    }
    //Method for calculating the rental cost
    private async sumPrice(countday: number) {
        return client
            .query(Requests.find(e => e.req == 'Sum Price'), [countday])
            .then((res) => {
                return res.rows[0].sum;
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
    }
    //Method for converting a date from a string or from a number
}