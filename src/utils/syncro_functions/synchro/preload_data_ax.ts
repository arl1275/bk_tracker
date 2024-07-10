import { executeQuery } from '../../db/ax_config';
import connDB from '../../db/localDB_config';
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
    query_get_pedidoventas,
    query_get_albarans_of_a_factura,
    query_get_boxes_of_an_albaran,
    query_get_facts_of_a_pedidoVenta,
    query_get_albaran_of_albaran_inserted_as_factura,
} from './simple_queries_synchro';
//||--------------------------------------------------------------------------------------------------------------------||
//||                          THIS FUNCTION RETURNS A PRELOADED OBJECT TO SINCRO PROCESS
//||--------------------------------------------------------------------------------------------------------------------||
//||            THIS FUNCTION HAS AS WELL, THE FUNCTION TO UPDATE DE DECLARACIONS OF ENVIO                              ||
//||--------------------------------------------------------------------------------------------------------------------||

export const Preloaded_pedido_AX = async () => {
    try {
        // this part if to update the declaraciones de envio
        const query_update_decenv = 'SELECT * FROM automatic_close_decenv();';
        await connDB.query(query_update_decenv);
        //----------------------------------------------------------------------------------------------------------------------------------------------------------//
        let preloadData: sincroObject[] = [];                               // this is to save all the details of all pedidos de venta
        let pdventas_: pedidoventa[] = [];                                  // this is to save the details of all pedidos de venta
        pdventas_ = await executeQuery(query_get_pedidoventas());
        
        if (pdventas_.length > 0) {
            console.log('||--------------------------------------------------------------------------------------------------------------------||');
            console.log('||                                                 GENERANDO LA PRECARGA                                              ||');
            console.log('||--------------------------------------------------------------------------------------------------------------------||');

            for (let i = 0; i < pdventas_.length; i++) {
                let pedido: pedidoventa = pdventas_[i];                         // this is to save one pedidodeVenta to be process
                let facturas_: factura[] = [];                                  // this is to save all the facturas of the pedidoVentas that is going to process
                let detalleFactura: detFact[] = [];                             // this is to save the details of the facturas of one pedidoVentas
                //console.log('|| PEDIDO : ', pedido.PedidoVenta, ' :: ', pedido.NombreCliente );

                facturas_ = await executeQuery( query_get_facts_of_a_pedidoVenta(pedido.PedidoVenta) );

                 if (facturas_.length > 0) {
                     for (let j = 0; j < facturas_.length; j++) {
                        
                         let albaranes_: albaran[] = [];                        // this is to save all albaranes of one factura to be process
                         let detalleAlbaran: detAlbaran[] = []                  // this is to save the detail of one albaran
                         const fact = facturas_[j];                             // this is to save one factura to be process
                        //  console.log('|| Factura : ', fact.Factura);
                        //  console.log(`||--------------------------------------------------------------------------------------------------------------------||`)
                         if (fact.Factura.startsWith('AL')) {
                             let alb_: albaran[] = await executeQuery(query_get_albaran_of_albaran_inserted_as_factura(fact.Factura, pedido.PedidoVenta));
                             albaranes_.push(alb_[0]);
                         } else {
                             let alb_: albaran[] = await executeQuery(query_get_albarans_of_a_factura(fact.Factura, pedido.PedidoVenta));
                             for (let a = 0; alb_.length > a; a++) {
                                 albaranes_.push(alb_[a]);
                             }
                         }
                         // FROM HERE STARTS THE DETAILS OF THE ALBARAN
                        if (albaranes_.length > 0) {
                            for (let k = 0; k < albaranes_.length; k++) {
                                let x: albaran = albaranes_[k];
                                const caja_s: caja[] = await executeQuery(query_get_boxes_of_an_albaran(x.Albaran));
                                //console.log(`||      ALBARANES : ${x.Albaran}`)
                                //console.log('||     DETALLE DE CAJAS ');
                                if (caja_s.length > 0) {    
                                    //console.log('|| CAJA :: ', caja_s);
                                    //caja_s.forEach((item : caja)=>{ console.log('||             _CAJA_: ', item.NumeroCaja, '     CAJA : ', item.Caja)})
                                    let detail_oneAlb: detAlbaran = { _albaran_: albaranes_[k], _cajas_: caja_s };
                                    detalleAlbaran.push(detail_oneAlb);
                                }else{
                                    //console.log(`||     NO HAY CAJAS DE ESTE ALBARAN : ${x.Albaran}`);
                                    return false;
                                }
                            }
                            console.log(`||--------------------------------------------------------------------------------------------------------------------||`)
                        } else {
                            console.log('||     NO HAY ALBARANES PRECARGADOS')
                            return false;
                        }

                         const detailOneFact: detFact = { _factura_: fact, detalleFact: detalleAlbaran };
                         detalleFactura.push(detailOneFact);
                     }
                 } else {
                     console.log('||     NO HAY FACTURAS PRECARGADAS')
                     return false;
                 }
                 const Detalle_pedido: sincroObject = { pedido: pedido, data: detalleFactura };
                 preloadData.push(Detalle_pedido);    
            }
            return preloadData;
        } else {
            console.log('||    NO HAY PEDIDOS, SIN PEDIDOS EN COLA EN PRECARGA')
            return false;
        }
    } catch (err) {
        console.log('||     ERROR AL PRECARGAR PEDIDOS ==> ', err)
        return false;
    }
}
