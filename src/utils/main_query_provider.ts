import { factura, albaran_interface, caja_interface, id_facturas } from '../interfaces/Axproveider';
import connDB from './psql_connection';

//---------------------------------------------------------//
//                  DEFAULT DATA FILTERS                   //
//---------------------------------------------------------//

const paisFilter = 'Honduras';                              // valor para filtrar por pais
const ciudadFilter = 'San Pedro Sula';                      // valor para setear las ubicaciones
const mininumDateAllowed = '2023-12-1';                     // valor para captar las facturas mas antiguas

//---------------------------------------------------------//
//                  QUERY DATA FILTERS                     //
//---------------------------------------------------------//

export const queryFact: string = `
SELECT 
    DISTINCT Factura,
    COUNT(Caja) AS Cant_Cajas,
    SUM(cantidad) AS Cant_Unidades,
    CuentaCliente,
    NombreCliente,
    calle,
    PedidoVenta
FROM IMGetAllPackedBoxesInSB 
WHERE 
    fecha >= '${mininumDateAllowed}' 
    AND Pais = '${paisFilter}' 
    AND ciudad = '${ciudadFilter}'
GROUP BY 
    Factura,
    CuentaCliente,
    NombreCliente,
    calle,
    PedidoVenta;
`;

// SELECT 
//     DISTINCT Factura,
//     COUNT(NumeroCaja) AS Cant_Cajas,
//     SUM(cantidad) AS Cant_Unidades,
//     CuentaCliente,
//     NombreCliente,
//     calle,
//     ubicacion,
//     COUNT(DISTINCT Albaran) as cant_albaranes
// FROM IMGetAllPackedBoxesInSB 
// WHERE 
//     fecha >= '${mininumDateAllowed}' 
//     AND Pais = '${paisFilter}' 
//     AND ciudad = '${ciudadFilter}'
//      GROUP BY 
//          Factura,
//          CuentaCliente,
//          NombreCliente,
//          calle,
//          ubicacion;



export const queryAlbaran = (factura : string) => {
  return `
  SELECT DISTINCT
     Albaran, 
     Empacador
 FROM IMGetAllPackedBoxesInSB 
 WHERE 
     fecha >= '${mininumDateAllowed}' 
     AND Pais= '${paisFilter}' 
     AND ciudad = '${ciudadFilter}' 
     AND Factura = '${factura}';`;
}

 


export const queryBoxFact= ( albaran : string ) =>{ 
  return `
  SELECT
    ListaEmpaque,
    Caja,
    NumeroCaja
  FROM IMGetAllPackedBoxesInSB 
    WHERE fecha >= '${mininumDateAllowed}' 
    AND Pais= '${paisFilter}' 
    AND ciudad = '${ciudadFilter}'
    AND Albaran = '${albaran}'
  GROUP BY ListaEmpaque, Caja, NumeroCaja;`
}

export const get_boxes_one_fact = ()=>{
  return `SELECT DISTINCT c.caja
  FROM facturas f
  INNER JOIN albaranes a ON f.id = a.id_factura
  INNER JOIN cajas c ON a.id = c.id_albaranes
  WHERE f.id = $1;`
}


//---------------------------------------------------------//
//             FUNCTION TO INSERT INTO DB AX INFO          //
//---------------------------------------------------------//

export const val_insert_facturas_nuevas = async (data: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const exist = false;
      connDB.query('SELECT EXISTS (SELECT 1 FROM facturas WHERE ref_factura = $1);', [data], (err, result) => {
        if (err) {
          console.error('Error executing query', err);
          reject(err); // Reject the promise in case of an error
        } else {
          if (result.rows[0].exists === false) {
            resolve(false); // Resolve the promise with false
          } else {
            //console.log('FACTURA YA EXISTE', data);
            resolve(true); // Resolve the promise with true
          }
        }
      });
    } catch (err) {
      console.log('NO SE PUDO VALIDAR LA FACTURA');
      resolve(true); // Resolve the promise with true in case of an exception
    }
  });
};


export const insert_factura = async (data: factura) => {
  return new Promise<id_facturas>((resolve, reject) => {
    const consult_ = `INSERT INTO facturas (ref_factura, cant_cajas, cant_unidades, cliente_cuenta, cliente_nombre, calle, ubicacion, pedidoventa)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning id;`;
    connDB.query(
      consult_,
      [
        data.Factura,
        data.Cant_Cajas,
        data.Cant_Unidades,
        data.CuentaCliente,
        data.NombreCliente,
        data.calle,
        data.ubicacion,
        data.PedidoVenta
      ],
      (err, result) => {
        if (!err && result.rows.length > 0 && result.rows[0].id) {
          const val = result.rows[0].id;
          resolve(val); // Resolve with the ID
        } else {
          //console.log('NO SE PUDO INGRESAR LA FACUTRA :', data);
          reject(err); // Reject with the error
        }
      }
    );
  });
};

export const insert_albaran = async (data: albaran_interface, id_: number) => {
  return new Promise<number | null>((resolve, reject) => {
    const query = `INSERT INTO albaranes (albaran, empacador, id_factura) VALUES ($1, $2, $3) returning id;`;
    connDB.query(query, [data.Albaran, data.Empacador, id_], (err, result) => {
      if (err) {
        //console.log('ALBARAN NO SE PUDO INGRESAR : ', data);
        reject(err); // Reject with error
      } else {
        let val = result.rows[0].id
        resolve(val); // Resolve with the ID
      }
    });
  });
};


export const insert_boxes = async (data: caja_interface, id_albaranes: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const query = 'INSERT INTO cajas (lista_empaque, caja, numcaja, id_albaranes) VALUES ($1, $2, $3, $4);';
    console.log('data para ingresar a cajas : ', data.ListaEmpaque, data.Caja, data.NumeroCaja, id_albaranes);
    connDB.query(query, [data.ListaEmpaque, data.Caja, data.NumeroCaja, id_albaranes], (err, result) => {
      if (err) {
        console.error('Error inserting box: ', err);
        reject(err); // Reject the promise if there's an error
      } else {
        //console.log('Box inserted');
        resolve(true); // Resolve the promise indicating successful insertion
      }
    });
  });
};


