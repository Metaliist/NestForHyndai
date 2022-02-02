import * as pg from 'pg';
export const pool = new pg.Pool({
  //  user: 'test',
    host: 'localhost',
    database: 'NestForHyndai',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
   // password: 'test',
    port: 5432
})
//pool.connect();