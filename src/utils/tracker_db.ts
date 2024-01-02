import { Pool } from "pg";
import * as dotenv from 'dotenv'
dotenv.config()
//test XD
// Configure the PostgreSQL connection
const connDB = new Pool({
  user: 'postgres',
  host: 'http://localhost:80',
  database: 'postgres',
  password: 'root123',
  port: 80, // Default PostgreSQL port
});

// Test the connection
connDB.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});

export default connDB;
