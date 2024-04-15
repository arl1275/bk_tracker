//-----------------------------------------------//
//  THIS REFERS TO OUR POSTGRES DB

import { Pool } from "pg";
import * as dotenv from 'dotenv'
dotenv.config()

const connDB = new Pool({
  user : process.env.DBuser,
  host : process.env.DBhost,
  database : process.env.DBdatabase,
  password : process.env.DBpassword,
  port : 5432, // Default PostgreSQL port
});

connDB.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});

export default connDB;
