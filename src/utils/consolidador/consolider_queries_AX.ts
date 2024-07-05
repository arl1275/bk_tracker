export const GetFacturasConsolidadas = ( factura : string)=>{
    if(factura.length > 1){
        return `
        SELECT * --Factura, listaEmpaque, fecha
        FROM IMGetAllPackedBoxesInSB
        WHERE ciudad = 'San Pedro Sula'
        AND Factura IN (
            SELECT Factura
            FROM IMGetAllPackedBoxesInSB
            WHERE ciudad = 'San Pedro Sula'
            AND factura = ${factura}
            GROUP BY Factura
            HAVING COUNT(DISTINCT listaEmpaque) > 1
        )
        order by fecha desc;`
    }else{
        return `
        SELECT * --Factura, listaEmpaque, fecha
        FROM IMGetAllPackedBoxesInSB
        WHERE ciudad = 'San Pedro Sula'
        AND Factura IN (
            SELECT Factura
            FROM IMGetAllPackedBoxesInSB
            WHERE ciudad = 'San Pedro Sula'
            GROUP BY Factura
            HAVING COUNT(DISTINCT listaEmpaque) > 1
        )
        order by fecha desc;`
    }
}