export interface ReqFacturas{
    id: number,
    ref_factura: string
    cliente: string
    cant_cajas: number
    cant_unidades: number
    lista_empaque: string
    state_name: string
    nombre: string
    placa: string
    ubicaciones: string
    fech: string
    fech_hora_entrega : string;
    hasSing : boolean;
    hasPic : boolean;
    hasId : string;
    nameSing?: string | FormData;
    namePic?: string | FormData;
    state : string;
}

export interface SingFormat{
    encoded : string,
    pathName : string,
}