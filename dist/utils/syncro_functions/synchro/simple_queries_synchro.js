"use strict";
//---------------------------------------------------------------------------------//
// THIS FILE IS TO EXPORT QUERIES THAT ARE USED IN OTHERS FILES TO SYNCRO AX DATA  //
//---------------------------------------------------------------------------------//
Object.defineProperty(exports, "__esModule", { value: true });
exports.change_factura_name = exports.insert_boxes = exports.insert_albaran = exports.insert_factura = exports.insert_pedido_venta = exports.get_Ax_head_albaranesFacturas = exports.get_head_albaranesAsFact = exports.val_if_caja = exports.val_if_albaran = exports.val_if_fact_exist = exports.val_if_pedido_venta = exports.ForceSincroFact_albaran = exports.ForceSincroFact_factura = exports.get_boxes_one_fact = exports.query_get_boxes_of_an_albaran = exports.query_get_albaran_of_albaran_inserted_as_factura = exports.query_get_albarans_of_a_factura = exports.query_get_facts_of_a_pedidoVenta = exports.query_get_pedidoventas = void 0;
//---------------------------------------------------------//
//                  DEFAULT DATA FILTERS                   //
//---------------------------------------------------------//
const utils_1 = require("../../handle_passwords/utils");
const clients_1 = require("../../special_clients/clients");
const paisFilter = 'Honduras'; // valor para filtrar por pais
const ciudadFilter = 'San Pedro Sula'; // valor para setear las ubicaciones
const mininumDateAllowed = (0, utils_1.obtenerFechaActual)(15); // valor para captar las facturas mas antiguas
//---------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------//
//                                                                                                     //
//                              THIS QUERIES ARE FOR GET THE DATA FROM AX                              //
//                                                                                                     //
//-----------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------//
// this query is to get all the pedidos de venta 
//-----------------------------------------------------------------------------------------------------//
const query_get_pedidoventas = () => {
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
  AND fecha > '${mininumDateAllowed}'

  --  _____________________________________________________________________________________________  --
  --||                                                                                             ||--
  --||        THIS IS TO FORCE SINCRONIZACION JUST ADD THE PEDIDOS THAT U WANT TO FORCE SINCRO     ||--
  --||_____________________________________________________________________________________________||--

--AND pedidoventa = '+' 
  
  --||_____________________________________________________________________________________________||-- 

  AND albaran != '' 
GROUP BY 
  PedidoVenta,
  NombreCliente,
  CuentaCliente;
    `;
};
exports.query_get_pedidoventas = query_get_pedidoventas;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all facturas of one pedido de venta
//-----------------------------------------------------------------------------------------------------//
const query_get_facts_of_a_pedidoVenta = (pedido) => {
    return `SELECT
  CASE
      WHEN (Factura != '' ) AND AlbaranCount = 1 THEN Factura
      WHEN (Factura IS NULL or Factura = '') AND AlbaranCount = 1 THEN Albaran
      WHEN (Factura != '') AND AlbaranCount > 1 THEN CONCAT(Factura, ', ', Albaran)
      WHEN (Factura = '') AND AlbaranCount > 1 THEN Albaran
  END AS Factura
FROM (
  SELECT
      Factura,
      Albaran,
      COUNT(*) AS AlbaranCount
  FROM (
      SELECT DISTINCT
          Factura,
          Albaran
      FROM IMGetAllPackedBoxesInSB
      WHERE
            (
              (Pais = '${paisFilter}' AND ciudad = '${ciudadFilter}')
              OR
              ( CuentaCliente IN (${clients_1.special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')}))
            )
            AND pedidoventa = '${pedido}'
            AND fecha >= '${mininumDateAllowed}'
            AND albaran != '' 
  ) AS Subquery
  GROUP BY Factura, Albaran
) AS FinalResults;`;
};
exports.query_get_facts_of_a_pedidoVenta = query_get_facts_of_a_pedidoVenta;
//-----------------------------------------------------------------------------------------------------//
const query_get_albarans_of_a_factura = (factura, pedido) => {
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
         fecha >= '${mininumDateAllowed}' 
         AND Pais= '${paisFilter}'
         AND Factura = '${factura}'
         AND albaran != '' ;`;
}; //--AND PedidoVenta = '${pedido}'
exports.query_get_albarans_of_a_factura = query_get_albarans_of_a_factura;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaran of one albaran that is beein inserted as factura
//-----------------------------------------------------------------------------------------------------//
const query_get_albaran_of_albaran_inserted_as_factura = (albaran, pedido_venta) => {
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
    AND fecha >= '${mininumDateAllowed}' -- COMMENT THIS LINE TO FORCE SINCRO
    AND Albaran = '${albaran}'
    AND PedidoVenta = '${pedido_venta}'
    AND (factura IS NULL OR factura = '');
`;
};
exports.query_get_albaran_of_albaran_inserted_as_factura = query_get_albaran_of_albaran_inserted_as_factura;
//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaranes of one factura
//-----------------------------------------------------------------------------------------------------//
const query_get_boxes_of_an_albaran = (albaran) => {
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
      AND fecha >= '${mininumDateAllowed}'
      AND Albaran = '${albaran}'
  GROUP BY
      ListaEmpaque,
      Caja,
      NumeroCaja,
      cantidad;`;
};
exports.query_get_boxes_of_an_albaran = query_get_boxes_of_an_albaran;
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
    return `SELECT 
  CASE 
      WHEN EXISTS (SELECT 1 FROM pedidoventas WHERE pedidoventa = $1) 
      THEN (SELECT MAX(id) FROM pedidoventas WHERE pedidoventa = $1) 
      ELSE NULL 
  END AS pedidoventa_id;
`;
};
exports.val_if_pedido_venta = val_if_pedido_venta;
const val_if_fact_exist = () => {
    return `SELECT 
  CASE 
      WHEN EXISTS (
          SELECT 1 
          FROM facturas f
          WHERE f.factura = $1
      ) 
      THEN (
          SELECT MAX(f.id)
          FROM facturas f 
          INNER JOIN pedidoventas p ON p.id = f.id_pedidoventas
          WHERE f.factura = $1 AND p.pedidoventa = $2
      ) 
      ELSE NULL 
  END AS factura_id;
`;
};
exports.val_if_fact_exist = val_if_fact_exist;
const val_if_albaran = () => {
    return `SELECT 
  CASE 
      WHEN EXISTS (SELECT 1 FROM albaranes a WHERE albaran = $1 AND a.id_facturas = $2) 
      THEN ( SELECT MAX(id) FROM albaranes a WHERE albaran = $1 AND a.id_facturas = $2) 
      ELSE NULL 
  END AS albaran_id;
`;
};
exports.val_if_albaran = val_if_albaran;
const val_if_caja = () => {
    return `SELECT 
  CASE 
      WHEN EXISTS (SELECT 1 FROM cajas c WHERE caja = $1 and c.id_albaran = $2) 
      THEN (SELECT id FROM cajas c WHERE caja = $1  and c.id_albaran = $2) 
      ELSE NULL 
  END AS caja_id;
`;
};
exports.val_if_caja = val_if_caja;
//------------------------------------------------------------------------------------------------//
// this is to update names of the facturas
// :: this querty is to bring all unupdated facturas of the DB
const get_head_albaranesAsFact = () => {
    return `
  SELECT distinct
    p.id as id_pedido,
    p.pedidoventa,
    f.id as id_factura, 
    f.factura, 
    a.id as id_albaran, 
    a.albaran,
    c.lista_empaque 
  FROM pedidoventas p 
  INNER JOIN facturas f ON p.id = f.id_pedidoventas 
  INNER JOIN albaranes a ON f.id = a.id_facturas
  INNER JOIN cajas c on a.id = c.id_albaran 
  WHERE f.factura LIKE 'AL-%' OR f.factura = '' OR f.factura IS NULL;`;
};
exports.get_head_albaranesAsFact = get_head_albaranesAsFact;
// :: this query is to bring the names of the facturas fom AX
const get_Ax_head_albaranesFacturas = (albaran, listaEmpaque, pedido) => {
    return `
  SELECT DISTINCT
    pedidoventa,
    factura,
    albaran,
    listaempaque
	FROM IMGetAllPackedBoxesInSB
	WHERE 
    albaran = '${albaran}'
    AND listaempaque = '${listaEmpaque}'
    AND pedidoventa = '${pedido}'
    AND (Factura IS NOT NULL AND Factura != '');`;
};
exports.get_Ax_head_albaranesFacturas = get_Ax_head_albaranesFacturas;
//-----------------------------------------------------------------------------------------------------//
//                         LOCAL DB QUERIES TO VALIDATE IF SOMETHIN EXIST                              //
const insert_pedido_venta = () => {
    return `INSERT INTO 
  pedidoventas (created_at, pedidoventa, clientenombre, clientecuenta) 
  VALUES ( CURRENT_TIMESTAMP, $1, $2, $3) returning id;`;
};
exports.insert_pedido_venta = insert_pedido_venta;
// THIA FUNCTION IS TO INSERT A FACTURA, WHERE "id_logs" is the id to bound the register with the log table
const insert_factura = () => {
    return `INSERT INTO 
  facturas (created_at, factura, _closed, id_pedidoventas, id_logs)
  VALUES ( CURRENT_TIMESTAMP, $1, false, $2, $3) returning id;`;
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
const change_factura_name = () => {
    return `UPDATE facturas SET factura = $1 WHERE id = $2;`;
};
exports.change_factura_name = change_factura_name;
