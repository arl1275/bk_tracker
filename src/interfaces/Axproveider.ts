export interface factura {
    Factura: string,
    Cant_Cajas: number,
    Cant_Unidades: number,
    CuentaCliente : string,
    NombreCliente : string,
    calle : string,
    ubicacion : string,
    PedidoVenta : string
}

export interface albaran_interface {
    Factura: string,
    Albaran: string,
    Empacador : string
}

export interface caja_interface {
    Factura : string,
    Caja : string,
    Albaran : string,
    ListaEmpaque : string,
    NumeroCaja : string,
    Empacador : string
}

export interface id_facturas{
    id : number,
}