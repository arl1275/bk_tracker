import sql, { ConnectionPool, Request, config } from 'mssql';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.AXUSER || !process.env.AXPASSWORD || !process.env.AXSERVER || !process.env.AXDATABASE) {
  throw new Error('One or more required environment variables are not defined.');
}

const configSQL: config = {
    user: process.env.AXUSER,
    password: process.env.AXPASSWORD,
    server: process.env.AXSERVER, // Your SQL Server instance
    database: process.env.AXDATABASE,
    options: {
      trustServerCertificate: true, // Set this to true to accept self-signed certificates
    },
  };

export const pool = new ConnectionPool(configSQL);

export async function executeQuery(query: string) {
  try {
    const poolConnect = await pool.connect(); 

    const result = await poolConnect.request().query(query); 
    return result.recordset; 
  } catch (error) {
    throw new Error(`Error executing query =>: ${error}`);
  }
}