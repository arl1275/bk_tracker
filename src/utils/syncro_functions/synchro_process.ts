import { executeQuery } from '../db/ax_config';
import {
    pedidoventa,
    factura,
    albaran,
    caja
} from '../../interfaces/db_interfeces/Axproveider';
import {
    query_get_pedidoventas,
    query_get_albarans_of_a_factura,
    query_get_boxes_of_an_albaran,
    query_get_facts_of_a_pedidoVenta,
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
        const pedidoventas_: pedidoventa[] = await executeQuery(query_get_pedidoventas());                                                 // obtain the ax pedido_venta
        if (pedidoventas_.length > 0) {
            console.log('//---------------------------------------------------------------------------------//')
            for (let i = 0; i < pedidoventas_.length; i++) {
                const pedido: pedidoventa = pedidoventas_[i];
                const exist_pedido = await val_insert_pedidoventas_nuevas(pedido.PedidoVenta);                                              // values if the pedido venta exist in LOCAL_DB
                console.log('PEDIDO VENTA YA EXISTE: ', pedido.PedidoVenta);
                if (exist_pedido === false) {
                    const id_pedido = await insert_pedidoVenta(pedido);                                                                     // insert the pedido_venta and return id    
                    console.log('   PEDIDO VENTA INSERTADO: ', pedido.PedidoVenta);
                    if (id_pedido) {
                        const facturas_: factura[] = await executeQuery(query_get_facts_of_a_pedidoVenta(pedido.PedidoVenta));             // get all facturas of one pedido_venta
                        for (let j = 0; j < facturas_.length; j++) {
                            const fact: factura = facturas_[j];
                            if (fact.Factura != '') {
                                const exist_factura = await val_insert_facturas_nuevas(fact.Factura);                                           // values if the factura already exist in LOCAL_DB
                                if (exist_factura === false) {
                                    const id_factura = await insert_factura_(fact, id_pedido);                                                  // insert the factura and return the id
                                    if (id_factura) {
                                        console.log('       FACTURA INGRESADA : ', fact.Factura);
                                        const albaran_: albaran[] = await executeQuery(query_get_albarans_of_a_factura(fact.Factura));         // gets all the albaranes of one factura
                                        for (let k = 0; k < albaran_.length; k++) {
                                            const _albaran = albaran_[k];
                                            const id_albaran = await insert_albaran_(_albaran, id_factura);                                     // insert albaran and return id
                                            if (id_albaran) {
                                                console.log('           ALBARAN INGRESADO : ', _albaran.Albaran);
                                                const cajas_: caja[] = await executeQuery(query_get_boxes_of_an_albaran(_albaran.Albaran));    // get all the cajas of one albaran
                                                for (let l = 0; l < cajas_.length; l++) {
                                                    const _caja = cajas_[l];
                                                    await insert_boxes_(_caja, id_albaran);
                                                    console.log('               CAJA INGRESADA : ', _caja.Caja);
                                                }
                                            }
                                        }
                                    }
                                }
                            }else{
                                console.log('       ERROR : FACTURA TIENEN CAMPO VACIO');
                            }
                        }
                    }
                }
            }
        } else {
            console.log('NO SE PUDO OBTENER LA LISTA DE PEDIDOS DE VENTA');
        }
    } catch (err) {
        console.log('NO SE PUDO INSERTAR PEDIDOS DE VENTA');
    }

}