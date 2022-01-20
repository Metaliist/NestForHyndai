import { Injectable } from '@nestjs/common';
import { Car } from './cars';
import { client } from './connectDB'
import { OrderMonth } from './dto/ordermount.dto';
import { req as Requests } from './Request'
@Injectable()
export class CarService {
    private readonly car: Car = new Car(0, 0, new Date('2022-01-01'), new Date('2022-01-03'));
    private async CheckTable() {
        return client
            .query(Requests.find(e => e.req == 'Check creation'))
            .catch(async e => {
                if (e.table == undefined) {
                    await this.CreateTable();
                }
            })
    }
    private async CreateTable() {
        client
            .query(Requests.find(e => e.req == 'Create table'))
            .catch(e => {
                console.log(e)
                throw new Error(e);
            })
    }
    private async CheckCar(IDcar: number, DateStart: Date, DateEnd: Date) {
        return await client
            .query(Requests.find(e => e.req == 'Check car'), [IDcar, DateStart, DateEnd])
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
    async Rezervecar(IDcar: number, DateStart: Date, DateEnd: Date) {
        if (!this.checkid(IDcar)) {
            return "The identification car is specified more than there is in the park"
        }
        let d = this.convertDate(DateStart, DateEnd);
        DateStart = d.DateStart;
        DateEnd = d.DateEnd;
        console.log(IDcar)
        console.log(typeof IDcar)
        if (DateStart < DateEnd) {
            if ((+DateEnd - +DateStart) / (60 * 60 * 24 * 1000) > 30) {
                return "It is not possible to reserve for more than 30 days";
            }
            if (DateStart.getDay() > 0 && DateStart.getDay() < 6) {
                return await this.Getstatuscar(IDcar, DateStart, DateEnd).then(async res => {
                    let Price: number;
                    await this.Calcprise(DateStart, DateEnd).then(price => {
                        Price = price;
                    });
                    switch (res) {
                        case false: return await this.Rezerved(IDcar, DateStart, DateEnd, Price).then((res) => {
                            if (res) {
                                return 'I have reserved a car, everything is fine';
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
    private async Rezerved(IDcar: number, DateStart: Date, DateEnd: Date, Price: number) {

    }
    async Getstatus(IDcar: number, DateStart: Date, DateEnd: Date) {
        if (!this.checkid(IDcar)) {
            return "The identification car is specified more than there is in the park"
        }
        let d = this.convertDate(DateStart, DateEnd);
        DateStart = d.DateStart;
        DateEnd = d.DateEnd;
        if (DateStart < DateEnd) {
            if ((+DateEnd - +DateStart) / (60 * 60 * 24 * 1000) > 30) {
                return "It is not possible to reserve for more than 30 days";
            }
            if (DateStart.getDay() > 0 && DateStart.getDay() < 6) {
                return await this.Getstatuscar(IDcar, DateStart, DateEnd).then(res => {
                    switch (res) {
                        case false: return "Not Rezerv";
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
    private async Getstatuscar(IDcar: number, DateStart: Date, DateEnd: Date) {
        if (!client._connected) {
            client.connect();
        }
        await this.CheckTable()
            .catch(err => { throw new Error(err); });
        return await this.CheckCar(IDcar, DateStart, DateEnd).then(res => {
            return res.rezerve;
        });

    }
    private async Calcprise(DateStart: Date, DateEnd: Date) {
        let day = ((+DateEnd - +DateStart) / (60 * 60 * 24 * 1000));
        return await this.SumPrice(day);

    }
    private async SumPrice(countday: number) {
    }
    private convertDate(DateStart: Date, DateEnd: Date) {
        if
            (
            (typeof (DateStart) === 'string' || typeof (DateStart) === 'number') ||
            (typeof (DateEnd) === 'string' || typeof (DateEnd) === 'number')
        ) {
            DateStart = new Date(DateStart);
            DateEnd = new Date(DateEnd);
        }
        return { DateStart: DateStart, DateEnd: DateEnd }
    }
    private checkid(idcar: number): boolean {
        return idcar < 5 && idcar >= 0;
    }
    async orderm(_ordermonth: OrderMonth) {
    }
    async ordermonthid(idcar: number, month: Date) {
        console.log(month)
        if (!this.checkid(idcar)) {
            return "The identification car is specified more than there is in the park"
        }
    }
    async ordermonth(month: Date) {
    }
}