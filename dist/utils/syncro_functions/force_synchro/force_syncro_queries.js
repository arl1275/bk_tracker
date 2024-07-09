"use strict";
//---------------------------------------------------------------------------------//
// THIS FILE IS TO EXPORT QUERIES THAT ARE USED IN OTHERS FILES TO SYNCRO AX DATA  //
//---------------------------------------------------------------------------------//
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert_boxes = exports.insert_albaran = exports.insert_factura = exports.insert_pedido_venta = exports.val_if_fact_exist = exports.val_if_pedido_venta = exports.ForceSincroFact_albaran = exports.ForceSincroFact_factura = exports.get_boxes_one_fact = exports.query_get_boxes_of_an_albaran_F = exports.query_get_albaran_of_albaran_inserted_as_factura_F = exports.query_get_albarans_of_a_factura_F = exports.query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F = exports.query_get_facts_of_a_pedidoVenta_F = exports.query_get_pedidoventas_F = void 0;
const clients_1 = require("../../special_clients/clients");
const paisFilter = 'Honduras'; // valor para filtrar por pais
const ciudadFilter = 'San Pedro Sula'; // valor para setear las ubicaciones
const mininumDateAllowed = '2024-01-01'; //obtenerFechaActual();          // valor para captar las facturas mas antiguas
//---------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------//
//                                                                                                     //
//                              THIS QUERIES ARE FOR GET THE DATA FROM AX                              //
//                                                                                                     //
//-----------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------//
// this query is to get all the pedidos de venta 
//-----------------------------------------------------------------------------------------------------//
const query_get_pedidoventas_F = (pedidoventa) => {
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
      ( CuentaCliente IN (${clients_1.special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')}))
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
};
exports.query_get_pedidoventas_F = query_get_pedidoventas_F;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all facturas of one pedido de venta
//-----------------------------------------------------------------------------------------------------//
const query_get_facts_of_a_pedidoVenta_F = (pedido) => {
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
        ( CuentaCliente IN (${clients_1.special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')}))
      )    
      AND pedidoventa = '${pedido}'
      AND albaran != '' 
    group by Factura, albaran
    ) AS Subquery;`;
};
exports.query_get_facts_of_a_pedidoVenta_F = query_get_facts_of_a_pedidoVenta_F;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all facturas of one pedido de venta
//-----------------------------------------------------------------------------------------------------//
const query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F = (pedido, factura) => {
    return `
    SELECT DISTINCT
        Factura
       FROM
           IMGetAllPackedBoxesInSB
       WHERE
       factura = '${factura}'
       AND pedidoventa = '${pedido}';`;
};
exports.query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F = query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F;
//-----------------------------------------------------------------------------------------------------//
const query_get_albarans_of_a_factura_F = (factura) => {
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
};
exports.query_get_albarans_of_a_factura_F = query_get_albarans_of_a_factura_F;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaran of one albaran that is beein inserted as factura
//-----------------------------------------------------------------------------------------------------//
const query_get_albaran_of_albaran_inserted_as_factura_F = (albaran, pedido_venta) => {
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
            (CuentaCliente IN (${clients_1.special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')}))
        )    
    AND Albaran = '${albaran}'
    ;
`; //--AND PedidoVenta = '${pedido_venta}'
};
exports.query_get_albaran_of_albaran_inserted_as_factura_F = query_get_albaran_of_albaran_inserted_as_factura_F;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaranes of one factura
//-----------------------------------------------------------------------------------------------------//
const query_get_boxes_of_an_albaran_F = (albaran, pedido) => {
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
      cantidad;`;
};
exports.query_get_boxes_of_an_albaran_F = query_get_boxes_of_an_albaran_F;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all cajas of one albaran
//-----------------------------------------------------------------------------------------------------//
const get_boxes_one_fact = () => {
    return `SELECT DISTINCT c.caja
      FROM facturas f
      INNER JOIN albaranes a ON f.id = a.id_factura
      INNER JOIN cajas c ON a.id = c.id_albaranes
      WHERE f.id = $1;`;
};
exports.get_boxes_one_fact = get_boxes_one_fact;
//-----------------------------------------------------------------------------------------------------//
// this query is to force the sincro of one factura
//-----------------------------------------------------------------------------------------------------//
const ForceSincroFact_factura = (pedido, factura) => {
    return `
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
  AND factura = ${factura};`;
};
exports.ForceSincroFact_factura = ForceSincroFact_factura;
const ForceSincroFact_albaran = (pedido, albaran) => {
    return `
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
    AND albaran = '${albaran}';`;
};
exports.ForceSincroFact_albaran = ForceSincroFact_albaran;
//-----------------------------------------------------------------------------------------------------//
//                                                                                                     //
//                      THIS QUERIES ARE FOR THE INSERTION IN THE LOCAL DB                             //
//                                                                                                     //
//-----------------------------------------------------------------------------------------------------//
const val_if_pedido_venta = () => {
    return `SELECT EXISTS (SELECT 1 FROM pedidoventas WHERE pedidoventa = $1);`;
};
exports.val_if_pedido_venta = val_if_pedido_venta;
const val_if_fact_exist = () => {
    return `SELECT EXISTS (
    SELECT 1 FROM pedidoventas p 
    INNER JOIN facturas f on p.id = f.id_pedidoventas
    WHERE f.factura = $1 and p.pedidoventa = $2);`;
};
exports.val_if_fact_exist = val_if_fact_exist;
const insert_pedido_venta = () => {
    return `INSERT INTO 
  pedidoventas (created_at, pedidoventa, clientenombre, clientecuenta) 
  VALUES ( CURRENT_TIMESTAMP, $1, $2, $3) returning id;`;
};
exports.insert_pedido_venta = insert_pedido_venta;
const insert_factura = () => {
    return `INSERT INTO 
  facturas (created_at, factura, _closed, id_pedidoventas)
  VALUES ( CURRENT_TIMESTAMP, $1, false, $2) returning id;`;
};
exports.insert_factura = insert_factura;
const insert_albaran = () => {
    return `INSERT INTO 
  albaranes (created_at, albaran, pais, departamento, ciudad, calle, ubicacion, empacador, id_facturas) 
  VALUES ( CURRENT_TIMESTAMP, $1, $2, $3, $4, $5, $6, $7, $8) returning id;`;
};
exports.insert_albaran = insert_albaran;
const insert_boxes = () => {
    return `INSERT INTO 
  cajas (created_at, lista_empaque, caja, numerocaja, cantidad, id_albaran) 
  VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4, $5);`;
};
exports.insert_boxes = insert_boxes;
