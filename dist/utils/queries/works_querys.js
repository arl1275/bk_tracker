"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data_to_repots_of_syncro_facts_entregadas = exports.data_to_repots_of_syncro_facts = exports.generate_dec_env = void 0;
const generate_dec_env = () => {
    return `INSERT INTO declaracion_envios (created_at, declaracionenvio, id_status, id_camion, id_usuario) 
    VALUES (
        CURRENT_TIMESTAMP, 
        (
            SELECT num
            FROM (
                SELECT generate_series(1, 1000000) AS num
            ) AS numbered_rows
            ORDER BY random()
            LIMIT 1
        ), 
        1,
        (SELECT id FROM camiones WHERE placa = $1), 
        (SELECT id FROM users WHERE nombre = $2)
    )
    RETURNING id, declaracionenvio;
    `;
};
exports.generate_dec_env = generate_dec_env;
exports.data_to_repots_of_syncro_facts = `select 
        distinct 
        p.pedidoventa,
        f.factura,
        p.clientenombre,
        a.albaran,
        a.ciudad,
        c.lista_empaque,
        de.declaracionenvio,
        COUNT(c.caja)::integer as cant_cajas,
        SUM(c.cantidad)::integer as cant_total,
        s.state_name
    from pedidoventas p 
        left join facturas f on p.id = f.id_pedidoventas 
        left join albaranes a on f.id = a.id_facturas 
        left join cajas c  on a.id = c.id_albaran
        left join declaracion_envios de on f.id_declaracion_envio = de.id 
        left join entregas e on f.id_entregas = e.id 
        left join status s on e.id_estados = s.id 
    where s.id = 2
        AND f.id = $1
    group by p.pedidoventa,
        f.factura,
        p.clientenombre,
        a.albaran,
        a.ciudad,
        c.lista_empaque,
        de.declaracionenvio,
        s.state_name;`;
const data_to_repots_of_syncro_facts_entregadas = () => {
    return `
    select 
        distinct 
        p.pedidoventa,
        f.factura,
        p.clientenombre,
        a.albaran,
        a.ciudad,
        c.lista_empaque,
        de.declaracionenvio,
        COUNT(c.caja)::integer as cant_cajas,
        SUM(c.cantidad)::integer as cant_total,
        s.state_name,
        e.link_firma,
        e.link_foto 
    from pedidoventas p 
        left join facturas f on p.id = f.id_pedidoventas 
        left join albaranes a on f.id = a.id_facturas 
        left join cajas c  on a.id = c.id_albaran
        left join declaracion_envios de on f.id_declaracion_envio = de.id 
        left join entregas e on f.id_entregas = e.id 
        left join status s on e.id_estados = s.id 
    where s.id = 3
        AND f.id = $1
    group by p.pedidoventa,
        f.factura,
        p.clientenombre,
        a.albaran,
        a.ciudad,
        c.lista_empaque,
        de.declaracionenvio,
        s.state_name,
        e.link_firma,
        e.link_foto;`;
};
exports.data_to_repots_of_syncro_facts_entregadas = data_to_repots_of_syncro_facts_entregadas;
