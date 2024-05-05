
THIS FILE IS TO EXPLAIN HOW SYNCHRO OF FACTURAS WORKS

//----------------------------------------------------------------------------------------// 
//                                  PRELOAD DATA                                          //
//----------------------------------------------------------------------------------------//

The preload data, is a sample of the data this sample is just a part of all data; this data is limitaded by date...
currently is around 7 days before, this preload also works to update data of facturas.
the preload is an array that has the next structure

[{
    pedidoVenta : string,
    nombreCliente : string,
    IdCliente : string

    [{
        facturas : string

        [{
            Albaran : string,
            ciudad : string,
            departamento : string,

            [{
                cajas : string,
                listaEmpaque : string,
                cantidad : number
            }]

        }]

    }]

}]

//----------------------------------------------------------------------------------------// 
//                                  INSERT OR UPDATE                                      //
//----------------------------------------------------------------------------------------//

1. When the preload is ready then the system will start to insert the factura or just update the factura
2. When pedidoventa does not exist, then the system will insert it in the localDB.
    2.1 When pedidoventa exist, then the system will iteract the array of facturas if a factura does not exist 
        will happen two things

        2.1.1   The sistem will check the Albaran and Ruta of the local DB, in case the new factura has the same 
                Albaran and the same Ruta the system will update the name, AND WILL FINISH THE UPDATE.
        2.1.2   The system check the albaran and the ruta and it is not the same, then that means that factura 
                is a new factura, then the system will do a normal insert.

    2.2 After update or insert the factura, then will interact tha albaran array in case does not exist
        it will be inserted, if case exist, it will be the next step.

    2.3 After update or insert albaranes, the system will be updating the boxes... 
