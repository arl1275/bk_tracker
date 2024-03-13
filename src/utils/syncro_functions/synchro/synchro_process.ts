import { executeQuery } from '../../db/ax_config';
import {
    pedidoventa,
    factura,
    albaran,
    caja
} from '../../../interfaces/db_interfeces/Axproveider';
import {
    query_get_pedidoventas,
    query_get_albarans_of_a_factura,
    query_get_boxes_of_an_albaran,
    query_get_facts_of_a_pedidoVenta,
    query_get_albaran_of_albaran_inserted_as_factura,
    val_if_pedido_venta
} from './simple_queries_synchro';
import {
    val_insert_pedidoventas_nuevas,
    val_insert_facturas_nuevas,
    insert_pedidoVenta,
    insert_factura_,
    insert_albaran_,
    insert_boxes_
} from './syncro_functions';

export const NORMAL_insert_process_of_synchro = async () => {
    try {
        //------------------------------------------------------------------------------------------------------------//
        //                              THIS PART OBTAIN THE PEDIDOS FROM AX
        //------------------------------------------------------------------------------------------------------------//

        const pedidoventas_: pedidoventa[] = await executeQuery(query_get_pedidoventas());

        if (pedidoventas_.length > 0) {

            for (let i = 0; i < pedidoventas_.length; i++) {
                const pedido: pedidoventa = pedidoventas_[i];
                const exist_pedido = await val_insert_pedidoventas_nuevas(pedido.PedidoVenta);

                if (exist_pedido === false) {

                    const id_pedido = await insert_pedidoVenta(pedido);
                    console.log(`
||------------------------------------------------------------------------------------------------------------||
||    PEDIDO-VENTA : ${pedido.PedidoVenta}                                                                    
||    CLIENTE : ${pedido.NombreCliente}                                                                       
||    CUENTA : ${pedido.CuentaCliente}                                                                        
||------------------------------------------------------------------------------------------------------------||`)
                    if (id_pedido) {
                        //------------------------------------------------------------------------------------------------------------//
                        //                       THIS PART OBTAIN THE SPECIFIC FACTURAS OF THE PEDIDOS DE VENTA
                        //------------------------------------------------------------------------------------------------------------//
                        const facturas_: factura[] = await executeQuery(query_get_facts_of_a_pedidoVenta(pedido.PedidoVenta));

                        for (let j = 0; j < facturas_.length; j++) {
                            const fact = facturas_[j];

                            if (fact) {
                                const exist_factura = await val_insert_facturas_nuevas(fact.Factura, pedido.PedidoVenta);                        // values if the factura already exist in LOCAL_DB
                                if (exist_factura === false) {
                                    const id_factura = await insert_factura_(fact, id_pedido);                                                  // insert the factura and return the id

                                    if (id_factura) {
                                        //----------------------------------------------------------------------------------------------------//
                                        //                  THIS IS TO HANDLE THE ALBARANES THAT DOES NOT HAVE FACTURA                        //
                                        //----------------------------------------------------------------------------------------------------//
                                        let albaran_: albaran[];

                                        if (fact.Factura.startsWith('AL')) { // if an albaran was inserted as factura, the get the albaran of that albaran
                                            console.log(`||         INSERTO COMO ALBARAN : ${fact.Factura}`);
                                            albaran_ = await executeQuery(query_get_albaran_of_albaran_inserted_as_factura(fact.Factura, pedido.PedidoVenta))
                                        } else {
                                            console.log(`||         FACTURA : ${fact.Factura}`);
                                            albaran_ = await executeQuery(query_get_albarans_of_a_factura(fact.Factura));                       // gets all the albaranes of one factura
                                        }
                                        //----------------------------------------------------------------------------------------------------//

                                        for (let k = 0; k < albaran_.length; k++) {
                                            const _albaran = albaran_[k];
                                            const id_albaran = await insert_albaran_(_albaran, id_factura);                                     // insert albaran and return id

                                            //------------------------------------------------------------------------------------------------------------//
                                            //                       THIS PART OBTAIN THE SPECIFIC CAJAS OF THE FACTURA                                   //
                                            //------------------------------------------------------------------------------------------------------------//
                                            if (id_albaran) {
                                                console.log(`||                 ALBARAN : ${_albaran.Albaran}   DESTINO : ${_albaran.ciudad}`);
                                                const cajas_: caja[] = await executeQuery(query_get_boxes_of_an_albaran(_albaran.Albaran));    // get all the cajas of one albaran
                                                for (let l = 0; l < cajas_.length; l++) {
                                                    const _caja = cajas_[l];
                                                    await insert_boxes_(_caja, id_albaran);
                                                    console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                console.log('// ERROR : FACTURA TIENEN CAMPO VACIO');
                            }
                        }
                        console.log('||------------------------------------------------------------------------------------------------------------||')
                    }
                } else {
                    console.log('// PEDIDO DE VENTA YA EXISTE : ', pedido.PedidoVenta)
                }
            }
        } else {
            console.log('NO SE PUDO OBTENER LA LISTA DE PEDIDOS DE VENTA');
        }
    } catch (err) {
        console.log('ERROR DURANTE LA SINCRONIZACIÓN : ', err);
    }

}