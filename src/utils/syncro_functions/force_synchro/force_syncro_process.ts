import { executeQuery } from '../../db/ax_config';
import {
    pedidoventa,
    factura,
    albaran,
    caja
} from '../../../interfaces/db_interfeces/Axproveider';
import {
    query_get_albaran_of_albaran_inserted_as_factura_F,
    query_get_albarans_of_a_factura_F,
    query_get_boxes_of_an_albaran_F,
    query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F,
    query_get_facts_of_a_pedidoVenta_F,
    query_get_pedidoventas_F
} from './force_syncro_queries'
import {
    insert_pedidoVenta,
    insert_factura_,
    insert_albaran_,
    insert_boxes_
} from '../synchro/syncro_functions';
import connDB from '../../db/localDB_config';


export const FORCE_insert_process_of_synchro = async (caja: string, tipo: number) => {

    try {
        //------------------------------------------------------------------------------------------------------------//
        //                              THIS PART OBTAIN THE PEDIDOS FROM AX
        //------------------------------------------------------------------------------------------------------------//

        // Obtienen todos los pedidos de venta de este día (hoy)

        const pedido_brute: any = await executeQuery(`SELECT DISTINCT pedidoventa, factura, albaran FROM IMGetAllPackedBoxesInSB WHERE Caja = '${caja}';`);
        
        const pedidoventas_: pedidoventa[] = await executeQuery(query_get_pedidoventas_F(pedido_brute[0].pedidoventa));

        if (pedidoventas_.length = 1) {
            for (let i = 0; i < pedidoventas_.length; i++) {
                const pedido: pedidoventa = pedidoventas_[i];

                if (pedido) {
                    const id_pedido = await insert_pedidoVenta(pedido);
                    console.log(`
||------------------------------------------------------------------------------------------------------------||
||    ESTE PEDIDO HA SIDO FORZADO SINCRONIZADO                                                                ||
||------------------------------------------------------------------------------------------------------------||
||    PEDIDO-VENTA : ${pedido.PedidoVenta}                                                                    
||    CLIENTE : ${pedido.NombreCliente}                                                                       
||    CUENTA : ${pedido.CuentaCliente}                                                                        
||------------------------------------------------------------------------------------------------------------||`)
                    if (id_pedido) {
                        //------------------------------------------------------------------------------------------------------------//
                        //    THIS PART OBTAIN THE SPECIFIC FACTURAS OF THE PEDIDOS DE VENTA IF THE REQ COMES WITH FACT OR ALBARAN
                        //------------------------------------------------------------------------------------------------------------//

                        // THIS PART INSERT ONLY ONE FACTURA
                        if (tipo == 1) {
                            console.log('||         INGRESO A INSERCION POR FACTURA : ', pedido_brute[0].factura === '' ? pedido_brute[0].albaran : pedido_brute[0].factura);

                            if (pedido_brute[0].factura === '' && pedido_brute[0].albaran != '') {
                                const AlbAsFact: any = await executeQuery(query_get_albaran_of_albaran_inserted_as_factura_F(pedido_brute[0].albaran, pedido.PedidoVenta));

                                if (AlbAsFact.length > 0) {
                                    const factu = AlbAsFact[0]?.Albaran
                                    console.log(' DATA DE LA FACTURA :: ', factu)
                                    const id_factura = await insert_factura_(factu, id_pedido);

                                    if (id_factura) {
                                        const _albaran: albaran = AlbAsFact[0];
                                        const id_albaran = await insert_albaran_(_albaran, id_factura);
                                        if (id_albaran) {
                                            const cajas_: caja[] = await executeQuery(query_get_boxes_of_an_albaran_F(_albaran.Albaran, pedido.PedidoVenta));    // get all the cajas of one albaran
                                            
                                            for (let l = 0; l < cajas_.length; l++) {
                                                const _caja = cajas_[l];
                                                await insert_boxes_(_caja, id_albaran);
                                                console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                                            }
                                            console.log('||     FORZADO SINCRONIZADO FINALIZADO SIN PROBLEMAS');
                                            return [true, { message : `SINCRONIZADO SIN PROBLEMAS COMO ALBARAN : ${pedido_brute[0].albaran}`}]
                                        } else {
                                            console.log('||     NO SE PUDO INGRESAR EL ALBARAN ');
                                            return [false, { message: 'NO SE PUDO INGRESAR EL ALBARAN' }];
                                        }
                                    } else {
                                        console.log('||     NO SE PUDO INSERTAR LA FCTURA COMO ALBARAN');
                                        return [false, { message: 'NO SE PUDO INGRESAR LA FACTURA COMO ALBARAN' }];
                                    }

                                } else {
                                    console.log('||     NO SE PUDO OBTENER EL ALBARAN INSERTED AS FACTURA');
                                    return [false, { message: 'NO SE PUDO OBTENER EL ALBARAN COMO FACTURA' }];
                                }

                            } else {
                                let fact: factura[] = await executeQuery(query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F(pedido.PedidoVenta, pedido_brute[0].factura));
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
                                                return [true, { message : `SE SINCRONIZO LA FACTURA : ${pedido_brute[0].factura}`}]
                                            }
                                        }

                                    }
                                } else {
                                    console.log('|| FACTURA NO EXISTE EN AX');
                                    return [false, { message: 'FACTURA NO EXISTE EN AX' }]
                                }

                            }
                        }
                        // THIS PART IS TO SYNCRO ALL THE PEDIDOVENTA
                        else if (tipo == 0) {
                            console.log('||         INGRESO A INSERCION DE PEDIDO COMPLETO : ', pedido.PedidoVenta);
                            const facturas_: factura[] = await executeQuery(query_get_facts_of_a_pedidoVenta_F(pedido.PedidoVenta));
                            //console.log('DATA DE FACTURAS : ', facturas_);

                            if(facturas_ ){

                                for (let j = 0; facturas_.length > j; j++) {
                                    const fact : factura = facturas_[j];

                                    if (fact) {
                                        const id_factura = await insert_factura_(fact, id_pedido);                                                  // insert the factura and return the id
    
                                        if (id_factura) {
                                            let albaran_: albaran[];
                                            if (fact.Factura.startsWith('AL')) { // if an albaran was inserted as factura, the get the albaran of that albaran
                                                console.log(`||         INSERTO COMO ALBARAN : ${fact.Factura}`);
                                                albaran_ = await executeQuery(query_get_albaran_of_albaran_inserted_as_factura_F(fact.Factura, pedido.PedidoVenta))
                                            } else {
                                                console.log(`||         FACTURA : ${fact.Factura}`);
                                                albaran_ = await executeQuery(query_get_albarans_of_a_factura_F(fact.Factura));                       // gets all the albaranes of one factura
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
                                                    const cajas_: caja[] = await executeQuery(query_get_boxes_of_an_albaran_F(_albaran.Albaran, pedido.PedidoVenta));    // get all the cajas of one albaran
                                                    for (let l = 0; l < cajas_.length; l++) {
                                                        const _caja = cajas_[l];
                                                        await insert_boxes_(_caja, id_albaran);
                                                        console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                                                    }

                                                    if( j === facturas_.length - 1 ){
                                                        return [true, { message : 'SE SINCRONIZO TODO EL PEDIDO.'}];
                                                    }
                                                    
                                                }
                                            }
                                        }else{
                                            console.log('|| ERROR FACTURA MAL INSERTADA');
                                            return [false, { message : 'Factura mal insertada'}];
                                        }
    
                                    } else {
                                        console.log('||  ERROR : FACTURA TIENEN CAMPO VACIO');
                                        return [false, {message : 'FACTURA VACIA'}];
                                    }
                                }

                            }else{
                                console.log('||     SIN FACTURAS ENCONTRADAS');
                                return [false, { message : 'NO SE ENCONTRO FACTURAS DE DICHO PEDIDO'}]
                            }
                            
                            console.log('||------------------------------------------------------------------------------------------------------------||')
                        } else {
                            console.log('||     ESTO NO DEBE PASAR EN EL FORZADO DE SINCRONIZACION');
                            return [false, { message: 'ESTE ES UN ERROR IMPOSIBLE' }];
                        }

                    } else {
                        console.log('|| NO SE INSERTO ID');
                        return [false, { message: 'NO SE INSERTO EL PEDIDO CORRECTAMENTE' }];
                    }

                } else {
                    console.log('||     PEDIDO DE VENTA NO RECONOCIDO : ', pedidoventas_);
                    return [false, { message: 'PEDIDO DE VENTA NO RECONOCIDO' }];
                }
            }

            console.log('||------------------------------------------------------------------------------------------------------------||')
        } else {
            console.log('||  PEDIDO DE VENTA TIENE MAS DE UNA COINCIDENCIA O NO EXISTE EN AX');
            return [false, { message: 'PEDIDO DE VENTA TIENEN MAS DE UNA COINCIDENCIA EN AX' }];
        }
    } catch (err) {
        console.log('||     ERROR DURANTE LA SINCRONIZACIÓN FORZADA : ', err);
        return [false, { message: 'ERROR DURANTE LA SINCRONIZACION FORZADA' }];
    }

}