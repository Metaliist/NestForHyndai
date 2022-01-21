import { Injectable } from '@nestjs/common';
import { CarService } from './cars.services';
import { client } from './connectDB'
import { OrderMonth } from './dto/ordermount.dto';
import { req as Requests } from './Request'
@Injectable()
export class OrderService {
    private readonly carService: CarService;
    //Top method for reports
    async orderm(_orderMonth: OrderMonth) {
        if (!client._connected) {
            client.connect(); //Connecting to the database
        }
        await this.carService.checkTable() //Table validation method
            .catch(err => { throw new Error(err); });
        await this.carService.checkTablePrice().catch(err => { throw new Error(err); });
        let Month;
        if (typeof (_orderMonth.month) === "string" || typeof (_orderMonth.month) === 'number') {
            Month = new Date(_orderMonth.month);
        }
        if (_orderMonth.all) {
            return this.orderMonth(Month);
        } else {
            return this.orderMonthID(_orderMonth.idCar, Month);
        }
    }
    //Method for reporting the average car load by id for the month
    async orderMonthID(idCar: number, month: Date) {
        console.log(month)
        if (!this.carService.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        let req = Requests.find(e => e.req == 'Order month');
        req.text = req.text.replace('1=1', '"IDCar" = $2');
        return await client
            .query(req, [month, idCar])
            .then((res) => {
                let _res;
                if (res.rows.length > 0) {
                    _res = res.rows[0];
                }
                else {
                    _res = { [req.ret[0]]: idCar, [req.ret[1]]: 0 }
                }
                return _res;
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
    }
    //Method for reporting the average load of all cars for the month
    async orderMonth(month: Date) {
        let req = Requests.find(e => e.req == 'Order month');
        req.text = req.text.replace('"IDCar" = $2', '1=1');
        return await client
            .query(req, [month])
            .then((res) => {
                let _res;
                if (res.rows.length > 0) {
                    _res = res.rows;
                }
                else {
                    _res = { [req.ret[1]]: 0 }
                }
                return _res;
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
    }
}
