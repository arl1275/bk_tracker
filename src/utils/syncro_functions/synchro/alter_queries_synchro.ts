//-------------------------------------------------------------------------------//
//  THIS FILE DEFINE THE FUNCTIONS THAT MAKE A QUICK INSERT
//  THIS IS USED IN THE ALTER SYNCRO
//-------------------------------------------------------------------------------//

import { executeQuery } from '../../db/ax_config';
import {
    pedidoventa,
    factura,
    albaran,
    caja,
    sincroObject,
    detFact,
    detAlbaran
} from '../../../interfaces/db_interfeces/Axproveider';
import {
    query_get_albaran_of_albaran_inserted_as_factura_F,
    query_get_albarans_of_a_factura_F,
    query_get_boxes_of_an_albaran_F,
    query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F,
    query_get_facts_of_a_pedidoVenta_F,
    query_get_pedidoventas_F
} from '../force_synchro/force_syncro_queries'
import {
    insert_pedidoVenta,
    insert_factura_,
    insert_albaran_,
    insert_boxes_
} from '../synchro/syncro_functions';

export async function quickFacturaInsert(id_pedido: number, pedido_: pedidoventa, facturaDetalle: detFact) {
    try {
        let factura = '', albaran = '';
        let pedido: pedidoventa = pedido_;

        if (facturaDetalle._factura_.Factura.startsWith('AL-')) {
            albaran = facturaDetalle._factura_.Factura;
        } else {
            factura = facturaDetalle._factura_.Factura;
        }

        if (factura != '' && albaran === '') {
            console.log('||         INGRESO A INSERCION POR FACTURA : ', factura);
            let fact: factura[] = await executeQuery(query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F(pedido.PedidoVenta, factura));
            if (fact) {
                const id_factura = await insert_factura_(fact[0], id_pedido);
                if (id_factura) {
                    console.log(`||         FACTURA : ${fact[0].Factura}`);

                    const albarans_: albaran[] = await executeQuery(query_get_albarans_of_a_factura_F(fact[0].Factura));
                    for (let k = 0; k < albarans_.length; k++) {
                        const _albaran = albarans_[k];
                        const id_albaran = await insert_albaran_(_albaran, id_factura);
                        if (id_albaran) {
                            console.log(`||                 ALBARAN : ${_albaran.Albaran}   DESTINO : ${_albaran.ciudad}`);
                            const cajas_: caja[] = await executeQuery(query_get_boxes_of_an_albaran_F(_albaran.Albaran, pedido.PedidoVenta));    // get all the cajas of one albaran
                            for (let l = 0; l < cajas_.length; l++) {
                                const _caja = cajas_[l];
                                await insert_boxes_(_caja, id_albaran);
                                console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                            }
                        }
                    }

                }
            } else {
                console.log('|| FACTURA NO EXISTE EN AX');
            }

        }
        // THIS PART IF TO INSERT ONLY ONE ALBARAN
        else if (albaran != '' && factura === '') {
            const albaran_: albaran[] = await executeQuery(query_get_albaran_of_albaran_inserted_as_factura_F(albaran, pedido.PedidoVenta));

            if (albaran_.length > 0) {
                const fact: factura = { Factura: albaran_[0].Albaran }
                const id_fact = await insert_factura_(fact, id_pedido);

                if (id_fact) {
                    console.log('||         INGRESO A INSERCION POR ALBARAN : ', fact);
                    const id_albaran = await insert_albaran_(albaran_[0], id_fact);
                    if (id_albaran) {
                        console.log(`||                 ALBARAN : ${albaran_[0].Albaran}   DESTINO : ${albaran_[0].ciudad}`);
                        const cajas_: caja[] = await executeQuery(query_get_boxes_of_an_albaran_F(albaran_[0].Albaran, pedido.PedidoVenta));    // get all the cajas of one albaran

                        for (let l = 0; l < cajas_.length; l++) {
                            const _caja = cajas_[l];
                            await insert_boxes_(_caja, id_albaran);
                            console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                        }
                    }
                } else {
                    console.log('||         NO SE PUDO INGRESAR EL ALBARAN')
                }
            }

        }

    } catch (err) {
        console.log(`||    ERROR AL ACTUALIZAR FACTURAS : ${err}`);
    }
}

export async function quickAlbaranInsert(id_factura: number, pedido : pedidoventa, detalleAlbaran: detAlbaran) {
    try {
        const _albaran : albaran = detalleAlbaran._albaran_;

        const id_albaran = await insert_albaran_(_albaran, id_factura);
        if (id_albaran) {
            console.log(`||                 ALBARAN : ${_albaran.Albaran}   DESTINO : ${_albaran.ciudad}`);
            const cajas_: caja[] = await executeQuery(query_get_boxes_of_an_albaran_F(_albaran.Albaran, pedido.PedidoVenta));    // get all the cajas of one albaran
            for (let l = 0; l < cajas_.length; l++) {
                const _caja = cajas_[l];
                await insert_boxes_(_caja, id_albaran);
                console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
            }
        }

    } catch (err) {
        console.log('|| ERROR AL AGREGAR UN ALBARAN')
    }

}

export async function quickBoxesInsert(id_albaran : number, detalleCaja : caja) {
    try {
        const inserted = await insert_boxes_( detalleCaja, id_albaran);
        if(inserted){
            console.log(`||                 CAJA AGREGADA :  ${detalleCaja.Caja}   CANTIDAD : ${detalleCaja.cantidad}    RUTA : ${detalleCaja.ListaEmpaque} `);
        }
    } catch (err) {
        console.log('|| ERROR AL AGREGAR UN ALBARAN', err);
    }
}