//---------------------------------------------------------------------------------//
// THIS FILE IS TO EXPORT QUERIES THAT ARE USED IN OTHERS FILES TO SYNCRO AX DATA  //
//---------------------------------------------------------------------------------//


//---------------------------------------------------------//
//                  DEFAULT DATA FILTERS                   //
//---------------------------------------------------------//

const paisFilter = 'Honduras';                              // valor para filtrar por pais
const ciudadFilter = 'San Pedro Sula';                      // valor para setear las ubicaciones
const mininumDateAllowed = '2024-1-1';                     // valor para captar las facturas mas antiguas

//---------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------//
//                                                                                                     //
//                              THIS QUERIES ARE FOR GET THE DATA FROM AX                              //
//                                                                                                     //
//-----------------------------------------------------------------------------------------------------//

//---------------------------------- THIS IS THE CORRECT WAY TO INSERT---------------------------------
// SELECT 
//     PedidoVenta, 
//     NombreCliente, 
//     CuentaCliente, 
//     COALESCE(NULLIF(Factura, ''),Albaran) AS Factura, 
//     Albaran
// FROM IMGetAllPackedBoxesInSB 
// WHERE 
//     Pais = 'Honduras'
//     AND ciudad = 'San Pedro Sula'
//     AND fecha >= '2023-12-01'
// GROUP BY 
//     PedidoVenta,
//     NombreCliente,
//     CuentaCliente, 
//     Factura, 
//     Albaran;


//-----------------------------------------------------------------------------------------------------//
// this query is to get all the pedidos de venta 
//-----------------------------------------------------------------------------------------------------//
export const query_get_pedidoventas = () =>{
  return `
  SELECT 
    PedidoVenta,
    NombreCliente,
    CuentaCliente
  FROM IMGetAllPackedBoxesInSB 
  WHERE 
    Pais = '${paisFilter}'
    AND ciudad = '${ciudadFilter}'
    AND Factura IS NOT NULL
    AND fecha >= '${mininumDateAllowed}'
  GROUP BY 
    PedidoVenta,
    NombreCliente,
    CuentaCliente;`;
}

//-----------------------------------------------------------------------------------------------------//
// this query is to get all facturas of one pedido de venta
//-----------------------------------------------------------------------------------------------------//
export const query_get_facts_of_a_pedidoVenta = (pedido : string) =>{
   return `
   SELECT
   CASE
       WHEN (Factura IS NOT NULL OR Factura != '') AND AlbaranCount = 1 THEN
           Factura
       WHEN (Factura IS NULL OR Factura = '') AND AlbaranCount = 1 THEN
           Albaran
       WHEN (Factura IS NOT NULL OR Factura != '') AND AlbaranCount >= 2 THEN
           CONCAT(Factura, ' ', Albaran)
   END AS Factura
FROM (
   SELECT distinct
   Factura,
   Albaran,
   COUNT(*) OVER (PARTITION BY Albaran) AS AlbaranCount
   FROM
       IMGetAllPackedBoxesInSB
   WHERE
       Pais = '${paisFilter}'
       AND Ciudad = '${ciudadFilter}'
       AND fecha >= '${mininumDateAllowed}'
       AND pedidoventa = '${pedido}'
   --and factura = '00207341'
 group by Factura, albaran
) AS Subquery;
    `;
  }


  // SELECT 
  //  distinct COALESCE(NULLIF(Factura, ''),Albaran) AS Factura
  //  FROM IMGetAllPackedBoxesInSB 
  //  WHERE 
  //   Pais = '${paisFilter}'
  //   AND ciudad = '${ciudadFilter}'
  //   AND PedidoVenta = '${pedido}'
  //   AND fecha >= '${mininumDateAllowed}';
  //   `
//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaranes of one factura
//-----------------------------------------------------------------------------------------------------//
export const query_get_albarans_of_a_factura = (factura: string) => {
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
         AND ciudad = '${ciudadFilter}' 
         AND Factura = '${factura}';`;
}

//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaran of one albaran that is beein inserted as factura
//-----------------------------------------------------------------------------------------------------//
export const query_get_albaran_of_albaran_inserted_as_factura = ( albaran : string, pedido_venta : string) => {
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
         AND ciudad = '${ciudadFilter}' 
         AND Albaran = '${albaran}'
         AND PedidoVenta = '${pedido_venta}'
         AND (factura is null or factura ='');`;
}

//-----------------------------------------------------------------------------------------------------//
// this query is to get all the albaranes of one factura
//-----------------------------------------------------------------------------------------------------//
export const query_get_boxes_of_an_albaran = (albaran: string) => {
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
    AND ciudad = '${ciudadFilter}'
    AND fecha >= '${mininumDateAllowed}'
    AND Albaran = '${albaran}'
GROUP BY
    ListaEmpaque,
    Caja,
    NumeroCaja,
	  cantidad;   
  `
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
