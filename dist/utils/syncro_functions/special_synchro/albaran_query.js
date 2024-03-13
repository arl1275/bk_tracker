"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_update_info_fromAX = exports.get_ids_pedidos_to_update = void 0;
const clients_1 = require("../../special_clients/clients");
const utils_1 = require("../../handle_passwords/utils");
const days_less = 3;
//---------------------------------------------------------------------------------------//
//                      LOCAL DB FUNCTIONS TO UPDATE ALBARANS
//---------------------------------------------------------------------------------------//
const get_ids_pedidos_to_update = () => {
    return `
    SELECT 
        p.id,
        p.pedidoventa,
        f.id, 
        f.factura, 
        a.id, 
        a.albaran  
    FROM pedidoventas p 
    INNER JOIN facturas f ON p.id = f.id_pedidoventas 
    INNER JOIN albaranes a ON f.id = a.id_facturas
    WHERE p.created_at >= '${(0, utils_1.obtenerFechaConAtraso)(days_less)}'; `;
};
exports.get_ids_pedidos_to_update = get_ids_pedidos_to_update;
const get_update_info_fromAX = () => {
    const paisFilter = 'Honduras';
    const ciudadFilter = 'San Pedro Sula';
    return `
    SELECT DISTINCT pedidoventa, factura, albaran 
    FROM IMGetAllPackedBoxesInSB 
    WHERE 
        (
            (Pais = '${paisFilter}' AND ciudad = '${ciudadFilter}')
            OR
            (CuentaCliente IN (
                (${clients_1.special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')})
            ))
        )
    AND pais = 'Honduras'
    AND albaran != ''
    AND Fecha >= '${(0, utils_1.obtenerFechaConAtraso)(days_less)}';
    `;
};
exports.get_update_info_fromAX = get_update_info_fromAX;
