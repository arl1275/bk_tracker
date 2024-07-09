//---------------------------------------------------------------------------------//
// THIS FILE IS TO EXPORT QUERIES THAT ARE USED IN OTHERS FILES TO SYNCRO AX DATA  //
//---------------------------------------------------------------------------------//



//---------------------------------------------------------//
//                  DEFAULT DATA FILTERS                   //
//---------------------------------------------------------//

import { obtenerFechaActual } from "../../handle_passwords/utils";
import { special_clients } from "../../special_clients/clients";


const paisFilter = 'Honduras';                             // valor para filtrar por pais
const ciudadFilter = 'San Pedro Sula';                     // valor para setear las ubicaciones
const mininumDateAllowed =  '2024-01-01'//obtenerFechaActual();          // valor para captar las facturas mas antiguas

//---------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------//
//                                                                                                     //
//                              THIS QUERIES ARE FOR GET THE DATA FROM AX                              //
//                                                                                                     //
//-----------------------------------------------------------------------------------------------------//


//-----------------------------------------------------------------------------------------------------//
// this query is to get all the pedidos de venta 
//-----------------------------------------------------------------------------------------------------//
export const query_get_pedidoventas_F = ( pedidoventa : string) =>{
  return `
  SELECT 
  PedidoVenta,
  NombreCliente,
  CuentaCliente
FROM IMGetAllPackedBoxesInSB
WHERE 
  (
      (Pais = '${paisFilter}' AND ciudad = '${ciudadFilter}')
      OR
      ( CuentaCliente IN (${special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')}))
  )
  AND Factura IS NOT NULL
  --  _____________________________________________________________________________________________  --
  --||                                                                                             ||--
  --||        THIS IS TO FORCE SINCRONIZACION JUST ADD THE PEDIDOS THAT U WANT TO FORCE SINCRO     ||--
  --||_____________________________________________________________________________________________||--

  AND pedidoventa = '${pedidoventa}' 
  
  --||_____________________________________________________________________________________________||-- 

  AND albaran != '' 
GROUP BY 
  PedidoVenta,
  NombreCliente,
  CuentaCliente;
    `;
}

//-----------------------------------------------------------------------------------------------------//
// this query is to get all facturas of one pedido de venta
//-----------------------------------------------------------------------------------------------------//
export const query_get_facts_of_a_pedidoVenta_F = (pedido : string ) =>{
   return `
   SELECT
      CASE
          WHEN ( Factura != '') AND AlbaranCount = 1 THEN Factura
          WHEN ( Factura IS NULL or factura = '') AND AlbaranCount = 1 THEN Albaran
          WHEN ( Factura != '') AND AlbaranCount > 1 THEN CONCAT(Factura, ' ', Albaran)
          WHEN ( Factura = '') AND AlbaranCount > 1 THEN Albaran
      END AS Factura
    FROM (
      SELECT distinct
      Factura,
      Albaran,
      COUNT(*) OVER (PARTITION BY Albaran) AS AlbaranCount
      FROM
          IMGetAllPackedBoxesInSB
      WHERE
      (
        (Pais = '${paisFilter}' AND ciudad = '${ciudadFilter}')
        OR
        ( CuentaCliente IN (${special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')}))
      )    
      AND pedidoventa = '${pedido}'
      AND albaran != '' 
    group by Factura, albaran
    ) AS Subquery;`;
  }


//-----------------------------------------------------------------------------------------------------//
// this query is to get all facturas of one pedido de venta
//-----------------------------------------------------------------------------------------------------//
export const query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F = (pedido : string, factura : string) =>{
    return `
    SELECT DISTINCT
        Factura
       FROM
           IMGetAllPackedBoxesInSB
       WHERE
       factura = '${factura}'
       AND pedidoventa = '${pedido}';`;
   }

//-----------------------------------------------------------------------------------------------------//
export const query_get_albarans_of_a_factura_F = (factura: string) => {
  return `
      SELECT DISTINCT
         Albaran,
         Pais,
         Departamento,
         ciudad,
         calle,
         ubicacion
     FROM IMGetAllPackedBoxesInSB 
     WHERE 
         --fecha >= '${mininumDateAllowed}' 
         Pais= '${paisFilter}'
         AND Factura = '${factura}'
         AND albaran != '' ;`;
}

//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaran of one albaran that is beein inserted as factura
//-----------------------------------------------------------------------------------------------------//
export const query_get_albaran_of_albaran_inserted_as_factura_F = ( albaran : string, pedido_venta : string) => {
  return `
  SELECT DISTINCT
        Albaran,
        Pais,
        Departamento,
        ciudad,
        calle,
        ubicacion
    FROM IMGetAllPackedBoxesInSB 
    WHERE 
        (
            (Pais = '${paisFilter}' AND ciudad = '${ciudadFilter}')
            OR
            (CuentaCliente IN (${special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')}))
        )    
    AND Albaran = '${albaran}'
    ;
`;//--AND PedidoVenta = '${pedido_venta}'
}

//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaranes of one factura
//-----------------------------------------------------------------------------------------------------//
export const query_get_boxes_of_an_albaran_F = (albaran: string, pedido : string) => {
  return `
  SELECT
	distinct
    ListaEmpaque,
    Caja,
    NumeroCaja,
    cantidad
  FROM
      IMGetAllPackedBoxesInSB 
  WHERE 
      Pais = '${paisFilter}'
      --AND fecha >= '${mininumDateAllowed}' -- COMMENT THIS LINE TO FORCE SINCRO
      AND Albaran = '${albaran}'
      --AND pedidoventa = '${pedido}'
  GROUP BY
      ListaEmpaque,
      Caja,
      NumeroCaja,
      cantidad;`
}

//-----------------------------------------------------------------------------------------------------//
// this query is to get all cajas of one albaran
//-----------------------------------------------------------------------------------------------------//
export const get_boxes_one_fact = () => {
  return `SELECT DISTINCT c.caja
      FROM facturas f
      INNER JOIN albaranes a ON f.id = a.id_factura
      INNER JOIN cajas c ON a.id = c.id_albaranes
      WHERE f.id = $1;`
}

//-----------------------------------------------------------------------------------------------------//
// this query is to force the sincro of one factura
//-----------------------------------------------------------------------------------------------------//

export const ForceSincroFact_factura = ( pedido : string, factura : string) => {
  return`
  SELECT DISTINCT 
  pedidoventa, 
  factura, 
  albaran,
  Pais,
  Departamento,
  ciudad,
  calle,
  ubicacion 
  FROM
      IMGetAllPackedBoxesInSB 
  WHERE pedidoventa = '${pedido}'
  AND factura = ${factura};`
}

export const ForceSincroFact_albaran = ( pedido : string , albaran : string) => {
  return`
  SELECT DISTINCT 
    pedidoventa, 
    factura, 
    albaran,
    Pais,
    Departamento,
    ciudad,
    calle,
    ubicacion
  FROM
    IMGetAllPackedBoxesInSB 
  WHERE 
    pedidoventa = '${pedido}'
    AND albaran = '${albaran}';`
}


//-----------------------------------------------------------------------------------------------------//
//                                                                                                     //
//                      THIS QUERIES ARE FOR THE INSERTION IN THE LOCAL DB                             //
//                                                                                                     //
//-----------------------------------------------------------------------------------------------------//

export const val_if_pedido_venta = () => {
  return `SELECT EXISTS (SELECT 1 FROM pedidoventas WHERE pedidoventa = $1);`
}

export const val_if_fact_exist = () =>{
  return `SELECT EXISTS (
    SELECT 1 FROM pedidoventas p 
    INNER JOIN facturas f on p.id = f.id_pedidoventas
    WHERE f.factura = $1 and p.pedidoventa = $2);`;
}

export const insert_pedido_venta = () => {
  return `INSERT INTO 
  pedidoventas (created_at, pedidoventa, clientenombre, clientecuenta) 
  VALUES ( CURRENT_TIMESTAMP, $1, $2, $3) returning id;`;
}

export const insert_factura = () => {
  return `INSERT INTO 
  facturas (created_at, factura, _closed, id_pedidoventas)
  VALUES ( CURRENT_TIMESTAMP, $1, false, $2) returning id;`;
}

export const insert_albaran = () => {
  return `INSERT INTO 
  albaranes (created_at, albaran, pais, departamento, ciudad, calle, ubicacion, empacador, id_facturas) 
  VALUES ( CURRENT_TIMESTAMP, $1, $2, $3, $4, $5, $6, $7, $8) returning id;`;
}

export const insert_boxes = () => {
  return `INSERT INTO 
  cajas (created_at, lista_empaque, caja, numerocaja, cantidad, id_albaran) 
  VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4, $5);`;
}
