import { Injectable } from '@nestjs/common';
import { CarService } from './cars.service';
import { pool } from './connectDB'
import { OrderMonth } from './dto/ordermount.dto';
import { req as Requests } from './Request'
import { WTableService } from './wtable.service';
@Injectable()
export class OrderService {
    constructor(private readonly carService: CarService, private readonly wtableService: WTableService) { }
    //Top method for reports
    async orderm(_orderMonth: OrderMonth) {
        await this.wtableService.checkTable() //Table validation method
            .catch(err => { throw new Error(err); });
        await this.wtableService.checkTablePrice().catch(err => { throw new Error(err); });
        let Month = new Date(_orderMonth.year, _orderMonth.month);;
        if (_orderMonth.all) {
            return this.orderMonth(Month);
        }
        return this.orderMonthID(_orderMonth.idCar, Month);
    }
    //Method for reporting the average car load by id for the month
    async orderMonthID(idCar: number, month: Date) {
        console.log(month)
        if (!this.wtableService.checkID(idCar)) {
            return "The identification car is specified more than there is in the park"
        }
        let req = Requests.find(e => e.req == 'Order month');
        req.text = req.text.replace('1=1', '"IDCar" = $2');

        let res = await pool
            .query(req, [month, idCar])
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
        if (res.rows.length > 0) {
            return res.rows[0];
        }  
        return { [req.ret[0]]: idCar, [req.ret[1]]: 0 }

    }
    //Method for reporting the average load of all cars for the month
    async orderMonth(month: Date) {
        let req = Requests.find(e => e.req == 'Order month');
        req.text = req.text.replace('"IDCar" = $2', '1=1');
        let res = await pool
            .query(req, [month])
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
        if (res.rows.length > 0) {
            return res.rows;
        }
            return{ [req.ret[1]]: 0 }

    }
}
