const { Client } = require('pg')
export const client = new Client({
    user: 'test',
    host: 'localhost',
    database: 'NestForHyndai',
    password: 'test',
    port: 5432,
    log: console.log
})