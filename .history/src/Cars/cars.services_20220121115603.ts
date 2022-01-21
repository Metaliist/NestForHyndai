import { Injectable } from '@nestjs/common';
import { Car } from './cars';
import { client } from './connectDB'
import { req as Requests } from './Request'
@Injectable()
export class CarService {
    private readonly car: Car = new Car(0, 0, new Date('2022-01-01'), new Date('2022-01-03'));
    //The method checks the existence of the table, via a query
     async checkTable() {
        return client
            .query(Requests.find(e => e.req == 'Check creation'))
            .catch(async e => {
                if (e.table == undefined) {
                    await this.createTable();
                }
            })
    }
    //The method creates a table with a query
     async createTable() {
        client
            .query(Requests.find(e => e.req == 'Create tableCars'))
            .catch(e => {
                console.log(e)
                throw new Error(e);
            })
    }
     async checkTablePrice() {
        return await client
            .query(Requests.find(e => e.req == 'Check Table Price'))
            .then(async res => {
                if (Object.values(res.rows[0])[0] == 0) {
                    return await this.fillTablePrice();
                }
            })
            .catch(async e => {
                if (e.table == undefined) {
                    return await this.createTablePrice().then(async () => {
                        return await this.fillTablePrice();
                    });
                }
            })
    }
    //The method creates a table with a query
     async createTablePrice() {
        return await client
            .query(Requests.find(e => e.req == 'Create TablePrice'))
            .then(res => { return res; })
            .catch(e => {
                console.log('err create' + e)
                throw new Error(e);
            })
    }
     async fillTablePrice() {
        return await client
            .query(Requests.find(e => e.req == 'Fill Table Price'))
            .catch(e => {
                console.log(e)
                throw new Error(e);
            })
    }
    //The method makes select records from the table and if there is a record, then there is a session, and the car is busy
    private async checkCar(idCar: number, dateStart: Date, dateEnd: Date) {
        return await client
            .query(Requests.find(e => e.req == 'Check car'), [idCar, dateStart, dateEnd])
            .then(res => {
                if (Object.values(res.rows[0])[0] == 0) {
                    return { err: false, errtext: '', rezerve: false }
                } else {
                    return { err: false, errtext: '', rezerve: true }
                }
            })
            .catch(e => {
                throw new Error(e);
            })
    }
    //The method reserves the car, makes an insert if the car is not occupied and the session satisfies the conditions
    async rezerveCar(idCar: number, dateStart: Date, dateEnd: Date) {
        if (!this.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        let d = this.convertDate(dateStart, dateEnd);
        dateStart = d.dateStart;
        dateEnd = d.dateEnd;
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
                    switch (res) {
                        case false: return await this.rezerved(idCar, dateStart, dateEnd, Price).then((res) => {
                            if (res) {
                                return 'I have reserved a car, everything is fine.Rental price: ' + Price;
                            }
                        });
                        case true: return 'The car has already been reserved, choose another car or dates.';
                    }
                });
            }
            else {
                return 'The beginning or end of the lease should fall on weekdays';
            }
        } else {
            return 'Dates are not correctly selected';
        }
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
        if (!this.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        let d = this.convertDate(dateStart, dateEnd);
        dateStart = d.dateStart;
        dateEnd = d.dateEnd;
        let price: number;
        if (dateStart < dateEnd) {
            if ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000) > 30) {
                return "It is not possible to reserve for more than 30 days";
            }
            if (dateStart.getDay() > 0 && dateStart.getDay() < 6) {
                return await this.getStatusCar(idCar, dateStart, dateEnd).then(async res => {
                    await this.calcPrise(dateStart, dateEnd).then(price => {
                        price = price;
                    });
                    switch (res) {
                        case false: return "Not Rezerv. Rental price: " + price;
                        case true: return "Rezerv";
                    }
                });
            }
            else {
                return 'The beginning or end of the lease should fall on weekdays';
            }
        } else {
            return 'Dates are not correctly selected';
        }

    }
    //The upper method for checking the status
    private async getStatusCar(idCar: number, dateStart: Date, dateEnd: Date) {
        if (!client._connected) {
            client.connect();
        }
        await this.checkTable()
            .catch(err => { throw new Error(err); });
        await this.checkTablePrice().catch(err => { throw new Error(err); });
        return await this.checkCar(idCar, dateStart, dateEnd).then(res => {
            return res.rezerve;
        });

    }
    //Method for calculating rental days
    private async calcPrise(dateStart: Date, dateEnd: Date) {
        let day = ((+dateEnd - +dateStart) / (60 * 60 * 24 * 1000));
        return await this.sumPrice(day);

    }
    //Method for calculating the rental cost
    private async sumPrice(countday: number) {
        return await client
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
    private convertDate(dateStart: Date, dateEnd: Date) {
        if
            (
            (typeof (dateStart) === 'string' || typeof (dateStart) === 'number') ||
            (typeof (dateEnd) === 'string' || typeof (dateEnd) === 'number')
        ) {
            dateStart = new Date(dateStart);
            dateEnd = new Date(dateEnd);
        }
        return { dateStart: dateStart, dateEnd: dateEnd }
    }
     checkID(idCar: number): boolean {
        return idCar < 5 && idCar >= 0; //Checking the machine ID
    }
}