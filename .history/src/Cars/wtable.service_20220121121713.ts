import { Injectable } from '@nestjs/common';
import { client } from './connectDB'
import { req as Requests } from './Request'
@Injectable()
export class WTableService {
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
}