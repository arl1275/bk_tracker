
export interface factura_db_ {
    fecha : Date; 
    pedidoVenta : string,
    factura : string;
    cliente : string;
    list_empaque : string;
    cant_cajas : number;
    cant_total : number;
    pais : string; 
    departamento: string; 
    ubicacion : string;
    estado : string;
}

export interface AllDetails {
    detalle_declaracion_envio : string,
    detalle_transito : string,
    detalle_entrega : string,
    detalle_sincronizado : string,
    detalle_pospuesto : string,
    detalle_cancelacion : string,
}





