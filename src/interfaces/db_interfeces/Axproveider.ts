export interface pedidoventa {
    PedidoVenta: string,
    NombreCliente: string,
    CuentaCliente: string
}

export interface factura {
    Factura: string,
}

export interface albaran {
    Albaran : string,
    Pais : string,
    Departamento : string,
    ciudad : string,
    calle : string,
    ubicacion : string,
    empacador : string
}

export interface caja {
    ListaEmpaque : string,
    Caja : string,
    NumeroCaja : string,
    cantidad : number
}
