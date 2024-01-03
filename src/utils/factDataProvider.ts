import sql, { ConnectionPool, Request } from 'mssql';
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  user: 'despasb',
  password: 'Int3r-M0d@.D3sB',
  server: 'gim-piso-dbo', // Your SQL Server instance
  database: 'IMAplicativos',
  options: {
    trustServerCertificate: true, // Set this to true to accept self-signed certificates
  },
};

export const getDataFromTempTable = async () => {
// server filter date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const isoString = currentDate.toISOString();
  console.log('fecha filter : ', isoString);

  //---------------------------------------------------------//
  //                  DEFAULT DATA FILTERS                   //
  //---------------------------------------------------------//
    
    const paisFilter = 'Honduras';                           // valor para filtrar por pais
    const ciudadFilter = 'San Pedro Sula';                   // valor para setear las ubicaciones
    const mininumDateAllowed = '2023-12-1';                  // valor para captar las facturas mas antiguas

  //---------------------------------------------------------//
  //                  DEFAULT DATA FILTERS                   //
  //---------------------------------------------------------//



  let pool: ConnectionPool | null = null;

  try {
    pool = await new sql.ConnectionPool(config).connect();
    const request: Request = pool.request();
    const query = 'SELECT * FROM IMGetAllPackedBoxesInSB;';
    const result = await request.query(query);
    //console.log('data : ' ,result.recordset);
    
    //console.log('Data from temporary table:', result.recordset.filter((item)=>{item.fecha < isoString}));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (err) {
        console.error('Error closing pool:', err);
      }
    }
  }
};

getDataFromTempTable();

