import connDB from '../../db/localDB_config';
import { pedidoventa, factura, albaran, caja } from '../../../interfaces/db_interfeces/Axproveider';
import {
  val_if_fact_exist,
  val_if_pedido_venta,
  insert_pedido_venta,
  insert_factura,
  insert_albaran,
  insert_boxes
} from './simple_queries_synchro';

//------------------------------------------------------------------------------//
//              THIS FILE HAVE THE FUNCTIONS TO SYNCRO FACTS WITH AX            //
//------------------------------------------------------------------------------//

export const val_insert_pedidoventas_nuevas = async (id_ : string) => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const exist = false;
      connDB.query(val_if_pedido_venta(), [id_], (err, result) => {
        if (err) {
          console.error('Error executing query ===> ', err);
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
}

export const val_insert_facturas_nuevas = async (factura: string, pedido : string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      connDB.query(val_if_fact_exist(), [factura, pedido], (err, result) => {
        if (err) {
          console.error('Error executing query : ', err);
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

export const insert_pedidoVenta = async (data : pedidoventa) => {
  return new Promise<number>((resolve, reject)=>{
    connDB.query(insert_pedido_venta(), 
    [data.PedidoVenta, data.NombreCliente, data.CuentaCliente], (err, result)=>{
      if (!err && result.rows.length > 0 && result.rows[0].id) {
        const val = result.rows[0].id;
        resolve(val); // Resolve with the ID
      } else {
        console.log('NO SE PUDO INGRESAR PEDIDO_VENTA :', data);
        console.log('ERROR: ', err);
        reject(err); // Reject with the error
      }
    })
  })
  
}

export const insert_factura_ = async (data: factura, id_ : number, id_log : number) => {
  return new Promise<number>((resolve, reject) => {
    connDB.query(
      insert_factura(), [ data.Factura, id_, id_log ],
      (err, result) => {
        if (!err && result.rows.length > 0 && result.rows[0].id) {
          const val = result.rows[0].id;
          resolve(val); // Resolve with the ID
        } else {
          console.log('NO SE PUDO INGRESAR LA FACUTRA :', data);
          reject(err); // Reject with the error
        }
      }
    );
  });
};

export const insert_albaran_ = async (data: albaran, id_: number) => {
  return new Promise<number>((resolve, reject) => {
    connDB.query(insert_albaran(), 
      [data.Albaran, data.Pais, data.Departamento, data.ciudad,
       data.calle, data.ubicacion, data.empacador, id_], (err, result) => {
      if (err) {
        console.log('ALBARAN NO SE PUDO INGRESAR : ', data, ' error : ', err);
        reject(err); // Reject with error
      } else {
        let val = result.rows[0].id
        resolve(val); // Resolve with the ID
      }
    });
  });
};

export const insert_boxes_ = async (data: caja, id_: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    connDB.query(insert_boxes(), 
    [data.ListaEmpaque, data.Caja, data.NumeroCaja, data.cantidad, id_], (err, result) => {
      if (err) {
        console.error('Error inserting box: ', err);
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(true); // Resolve the promise indicating successful insertion
      }
    });
  });
};


