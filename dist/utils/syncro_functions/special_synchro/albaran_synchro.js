"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert_albaran_as_fact = void 0;
const insert_albaran_as_fact = (pedido) => {
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
};
exports.insert_albaran_as_fact = insert_albaran_as_fact;
//# sourceMappingURL=albaran_synchro.js.map