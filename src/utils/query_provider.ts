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
    f.id_consolidado IS NULL;`;