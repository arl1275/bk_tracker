import { Pool } from "pg";
//test XD
// Configure the PostgreSQL connection
const connDB = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'track',
  password: 'root',
  port: 5432, // Default PostgreSQL port
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
