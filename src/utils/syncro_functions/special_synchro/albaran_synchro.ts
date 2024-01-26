export const insert_albaran_as_fact = (pedido : string) =>{
    return `
    SELECT  
        COALESCE(NULLIF(Factura, ''), Albaran) AS Factura,
    FROM IMGetAllPackedBoxesInSB 
    WHERE 
     Pais = 'Honduras'
     AND ciudad = 'San Pedro Sula'
     AND fecha >= '2023-12-01'
	 AND PedidoVenta = '${pedido}'
	 AND albaran is not null`;
}