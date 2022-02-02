//const { Client } = require('pg');
import * as pg from 'pg';

export const pool = new pg.Pool({
  max: 100,
  user: 'test',
  host: 'localhost',
  database: 'test',
  password: 'test',
  port: 5432,
});
// pool.connect();

export const client = pool;
