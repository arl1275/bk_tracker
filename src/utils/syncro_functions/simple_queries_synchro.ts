//---------------------------------------------------------------------------------//
// THIS FILE IS TO EXPORT QUERIES THAT ARE USED IN OTHERS FILES TO SYNCRO AX DATA  //
//---------------------------------------------------------------------------------//


//---------------------------------------------------------//
//                  DEFAULT DATA FILTERS                   //
//---------------------------------------------------------//

const paisFilter = 'Honduras';                              // valor para filtrar por pais
const ciudadFilter = 'San Pedro Sula';                      // valor para setear las ubicaciones
const mininumDateAllowed = '2023-12-1';                     // valor para captar las facturas mas antiguas

//---------------------------------------------------------//

export const get_all_facturas_without_state = `
SELECT 
    DISTINCT 
    f.ref_factura,
    f.id,
    c.lista_empaque, 
    f.cliente_nombre, 
    f.cant_cajas, 
    f.cant_unidades,
    f.created_at,
    f.pedidoventa,
    al.albaran
FROM 
    facturas f 
INNER JOIN 
    albaranes al ON al.id_factura = f.id 
INNER JOIN 
    cajas c ON c.id_albaranes = al.id 
WHERE 
    f.id_consolidado IS NULL;`
;

//---------------------------------------------------------//
//             QUERY TO GET FACTURAS FROM AX_DB            //
//---------------------------------------------------------//

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

export const query_get_facts_of_a_pedidoVenta = (pedido : string) =>{
   return `
   SELECT 
    DISTINCT Factura
   FROM IMGetAllPackedBoxesInSB 
   WHERE 
    Pais = '${paisFilter}'
    AND ciudad = '${ciudadFilter}'
    AND PedidoVenta = '${pedido}'
    AND fecha >= '${mininumDateAllowed}';
    `;
  }

export const query_get_albarans_of_a_factura = (factura: string) => {
  return `
      SELECT DISTINCT
         Albaran,
         Pais,
         Departamento,
         ciudad,
         calle,
         ubicacion,
         empacador
     FROM IMGetAllPackedBoxesInSB 
     WHERE 
         fecha >= '${mininumDateAllowed}' 
         AND Pais= '${paisFilter}' 
         AND ciudad = '${ciudadFilter}' 
         AND Factura = '${factura}';`;
}

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

export const get_boxes_one_fact = () => {
  return `SELECT DISTINCT c.caja
      FROM facturas f
      INNER JOIN albaranes a ON f.id = a.id_factura
      INNER JOIN cajas c ON a.id = c.id_albaranes
      WHERE f.id = $1;`
}

//---------------------------------------------------------//
//          QUERY TO PUSH FACTURAS IN POSTGRES_DB          //
//---------------------------------------------------------//

export const val_if_pedido_venta = () => {
  return `SELECT EXISTS (SELECT 1 FROM pedidoventas WHERE pedidoventa = $1);`
}

export const val_if_fact_exist = () =>{
  return `SELECT EXISTS (SELECT 1 FROM facturas WHERE factura = $1);`;
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
