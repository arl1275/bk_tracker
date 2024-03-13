import { special_clients } from "../../special_clients/clients";
import { obtenerFechaConAtraso } from "../../handle_passwords/utils";
const days_less = 3;
const days_less_ax = 6;
//---------------------------------------------------------------------------------------//
//                      LOCAL DB FUNCTIONS TO UPDATE ALBARANS
//---------------------------------------------------------------------------------------//

export const get_ids_pedidos_to_update = () => {
    return `
    SELECT 
        p.id as pedido_id,
        p.pedidoventa,
        f.id as factura_id, 
        f.factura, 
        a.id as albaran_id, 
        a.albaran  
    FROM pedidoventas p 
    INNER JOIN facturas f ON p.id = f.id_pedidoventas 
    INNER JOIN albaranes a ON f.id = a.id_facturas
    WHERE p.created_at >= '${obtenerFechaConAtraso(days_less)}'; `;
}

export const get_update_info_fromAX = () => {
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
                (${special_clients.map(client => `'${client.CuentaCliente}'`).join(', ')})
            ))
        )
    AND pais = 'Honduras'
    AND albaran != ''
    AND Fecha >= '${obtenerFechaConAtraso(days_less_ax)}';
    `;
}
