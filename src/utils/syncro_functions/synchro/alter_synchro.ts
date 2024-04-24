import { Preloaded_pedido_AX } from "./preload_data_ax";
import connDB from "../../db/localDB_config";
import { QueryResult } from 'pg';
import {
    caja,
    sincroObject,
    detFact,
    detAlbaran
} from '../../../interfaces/db_interfeces/Axproveider';
import {
    val_if_pedido_venta,
    val_if_albaran,
    val_if_fact_exist,
    val_if_caja,
    change_factura_name,
    get_head_albaranesAsFact
} from './simple_queries_synchro';
import {
    insert_pedidoVenta,
    insert_factura_,
    insert_albaran_,
    insert_boxes_,
} from './syncro_functions';
import {
    quickAlbaranInsert,
    quickFacturaInsert,
    quickBoxesInsert
} from "./alter_queries_synchro";


async function UpdateOrNone_Pedido(pedido_: sincroObject) {
    //----------------------------------------------------------------------------------------------------------------------------------//
    //  THIS FUNCITON IS TO SEEK FOR UPDATES IN THE PEDIDOS
    //  FIRST VALIDATES THE FACTURAS IF A FACTURA ALREADY EXIST, THEN IT'LL GO RIGHT TO THE ALBARAN, THEN CAJAS AND FINISH
    //  BUT IF THE FACTURA NOT EXIST::
    //         1._ FIRST VALIDATE IF THE FACTURA HAS ITS ALBARAN INSERTED IN THE DB, THAT MEANS THAT FACTURA ALREADY EXIST
    //             BUT IT EXIST AS ALBARAN NOT AS A FACTURA, THEN UPDATE THE NAME OF THE FACTURA
    //         2._ IF THE ALBARAN OF THE NEW FACTURA DOES NOT EXIST IN THE LOCAL DB, THAT MEANS IS A NEW FACTURA, THEN MADE A NORMAL 
    //             FACTURA INSERTION.
    //----------------------------------------------------------------------------------------------------------------------------------//
    try {
        type PedidoExistResult = QueryResult<{pedidoventa_id: number | null;}>;

        const idPDV: PedidoExistResult = await connDB.query(val_if_pedido_venta(), [pedido_.pedido.PedidoVenta]);

        if (idPDV.rows.length > 0) {

            const pedidoventa_id: number | null = idPDV.rows[0].pedidoventa_id;

            if (typeof pedidoventa_id === 'number') {

                for (let i = 0; pedido_.data.length > i; i++) {

                    const detalleFacturas: detFact = pedido_.data[i];
                    const existFact = await connDB.query(val_if_fact_exist(), [detalleFacturas._factura_.Factura, pedido_.pedido.PedidoVenta]);
                    const existFact_id: number | null = existFact.rows[0].factura_id;

                    if (typeof existFact_id === 'number') {
                        //console.log(`||     SIN MODIFICACIONES EN FACTURA : ${detalleFacturas._factura_.Factura} `)
                        for (let j = 0; detalleFacturas.detalleFact.length > j; j++) {

                            const detalleAlbaran: detAlbaran = detalleFacturas.detalleFact[j];
                            const existAlb = await connDB.query(val_if_albaran(), [detalleAlbaran._albaran_.Albaran, existFact_id]);
                            const existAlb_id: number | null = existAlb.rows[0].albaran_id;

                            if (typeof existAlb_id === 'number') {
                                //console.log(`||     SIN MODIFICACIONES EN ALBARAN : ${detalleAlbaran._albaran_.Albaran} `);
                                let count_cajas_agregadas = 0;

                                for (let k = 0; detalleAlbaran._cajas_.length > k; k++) {
                                    const caja_: caja = detalleAlbaran._cajas_[k];
                                    const existCaja = await connDB.query(val_if_caja(), [caja_.Caja, existAlb_id]);
                                    const existCaja_id: number | null = existCaja.rows[0].caja_id
                                    if (existCaja_id === null) {
                                        await quickBoxesInsert(existAlb_id, caja_);
                                        count_cajas_agregadas += 1;
                                    }
                                }

                            } else {
                                if (existFact_id)
                                    await quickAlbaranInsert(existFact_id, pedido_.pedido, detalleAlbaran);
                            }
                        }

                    } else if (existFact_id === null) {
                        if (typeof pedidoventa_id === 'number') {
                            //---------------------------------------------------------------------------------------------------------------//
                            // HERE IS WHERE WE NEED TO MAKE THE CHANGE,
                            // IF THE NEW FACTURA HAS THE SAME ALBARAN AND SAME LISTA-EMPAQUE, CHANGE THE ALBARAN FOR THE FACTURA
                            // THI IS IN THE FACTURAS TABLE, NOT IN THE ALBARAN TABLE
                            //---------------------------------------------------------------------------------------------------------------//
                            try {
                                const facturasHead: any = await connDB.query(get_head_albaranesAsFact());
                                const facturasAsAlb: any = facturasHead.rows
                                if (facturasAsAlb.length > 0) {

                                    for (let x = 0; facturasAsAlb.length > x; x++) { // facturasAsAlb.length

                                        for (let y = 0; detalleFacturas.detalleFact.length > y; y++) {

                                            if (facturasAsAlb[x].albaran === detalleFacturas.detalleFact[y]._albaran_.Albaran &&
                                                facturasAsAlb[x].lista_empaque === detalleFacturas.detalleFact[y]._cajas_[0].ListaEmpaque &&
                                                facturasAsAlb[x].factura !== detalleFacturas._factura_.Factura
                                            ) {
                                                // let id_factura = await connDB.query(val_if_fact_exist(), [detalleFacturas.detalleFact[y]._albaran_.Albaran, pedido_.pedido.PedidoVenta]);
                                                //console.log('ID DE LA FACTURA :: ', facturasAsAlb[x].id_factura, detalleFacturas._factura_.Factura, detalleFacturas.detalleFact[0]._albaran_.Albaran, facturasAsAlb[x].albaran)
                                                await connDB.query(change_factura_name(), [detalleFacturas._factura_.Factura, facturasAsAlb[x].id_factura]);
                                                console.log(`|| ACTULIZANDO NOMBRE DE FACTURA DE ::: ${facturasAsAlb[x].factura} === A ===> ${detalleFacturas._factura_.Factura}  `)
                                            }
                                        }

                                    }

                                } else {
                                    await quickFacturaInsert(pedidoventa_id, pedido_.pedido, detalleFacturas);
                                }

                            } catch (error) {
                                console.log('ERRO AL ACTUALIZAR FACTURA :: ', error);
                            }

                        }

                        else
                            console.log('|| ERROR EN EL ID DE FACTURA : ', existFact_id);
                    }

                }
            } else {
                console.log('|| NO SE PUDO OBTENER EL ID DEL PEDIDO');
            }
        } else {
            console.log('|| SIN RESULTADOS DEL ID DEL PEDIDO DE VENTA');
        }

    } catch (err) {
        console.log(`
        ||--------------------------------------------------------------------------||
        ||  EEROR AL MOMENTO DE SINCRONIZAR : ${err}
        ||--------------------------------------------------------------------------||`);
    }
}

async function validinert(pedido: sincroObject) {
    //-----------------------------------------------------------------------------------------------------------//
    // THIS FUNCTION IS TO VERIFY IS A PEDIDO ALREADY EXIST, IF EXIST THEN SEEK FOR UPDATES
    // IN CASE NO EXIST IT MAKES ALL FULL INSERTION
    //-----------------------------------------------------------------------------------------------------------//
    try {
        if (pedido) {

            type PedidoExistResult = QueryResult<{
                pedidoventa_id: number | null;
            }>;

            const pedidoExist: PedidoExistResult = await connDB.query(val_if_pedido_venta(), [pedido.pedido.PedidoVenta]);

            if (pedidoExist.rows.length > 0) {

                const pedidoventa_id: number | null = pedidoExist.rows[0].pedidoventa_id;

                if (typeof pedidoventa_id === 'number') {

                    // IF THE PEDIDO EXIST, WE WILL HANDLE IT IN ANOTHER FUNCTION TO CHECK ALL THE DATA OF THAT PEDIDO

                    console.log('||--------------------------------------------------------------------------------------------------------------------||');
                    console.log(`||                         ACTUALIZANDO PEDIDO : ${pedido.pedido.PedidoVenta}`);
                    console.log('||--------------------------------------------------------------------------------------------------------------------||');

                    await UpdateOrNone_Pedido(pedido)

                } else if (pedidoventa_id === null) {
                    // IF THE PEDIDO DOES NOT EXIST, THEN WE'LL DO A NORMAL INSERTION
                    try {
                        const idPDV = await insert_pedidoVenta(pedido.pedido);
                        if (idPDV) {
                            // PRINT OF THE CONSOLE
                            console.log(`
||--------------------------------------------------------------------------------------------------------------------||
||  PEDIDO : ${pedido.pedido.PedidoVenta} 
||  CLIENTE : ${pedido.pedido.NombreCliente}
||  CUENTA : ${pedido.pedido.CuentaCliente}
||--------------------------------------------------------------------------------------------------------------------||`
                            );

                            for (let i = 0; pedido.data.length > i; i++) { //pedido.data.length
                                const detFactt: detFact = pedido.data[i];
                                const id_factura = await insert_factura_(detFactt._factura_, idPDV);

                                if (id_factura) {

                                    console.log(`||  FACTURA : ${detFactt._factura_.Factura}`);

                                    for (let j = 0; detFactt.detalleFact.length > j; j++) { // detFactt.detalleFact.length
                                        const detAlb: detAlbaran = detFactt.detalleFact[j];
                                        const id_alb = await insert_albaran_(detAlb._albaran_, id_factura);

                                        if (id_alb) {

                                            console.log(`||  ALBARAN : ${detAlb._albaran_.Albaran}`);
                                            console.log(`||  DESTINO : ${detAlb._albaran_.calle}`);
                                            console.log('||--------------------------------------------------------------------------------------------------------------------||')
                                            for (let k = 0; detAlb._cajas_.length > k; k++) { //detAlb._cajas_.length
                                                //if(k === 1) break;
                                                const detCajas: caja = detAlb._cajas_[k];
                                                const inserted = await insert_boxes_(detCajas, id_alb);
                                                if (inserted) {
                                                    console.log(`||          CAJA : ${detCajas?.Caja}     RUTA : ${detCajas?.ListaEmpaque}     CANTIDAD : ${detCajas?.cantidad}`)
                                                }
                                            }
                                            console.log('||--------------------------------------------------------------------------------------------------------------------||')
                                        }

                                    }
                                }

                            }

                        }

                    } catch (err) {
                        console.log('||--------------------------------------------------------------------------------------------------------------------||');
                        console.log(`||     ERROR AL MOMENTO DE INSERTAR NORMALMANTE : ${err}`);
                        console.log('||--------------------------------------------------------------------------------------------------------------------||');
                    }
                }
            } else {
                console.log('||     NO HAY RESPUESTA DEL PEDIDO DE VENTA DEL SERVIDOR LOCAL')
            }

        } else {
            return false;
        }
    } catch (err) {
        console.log('||     ERROR AL DESGLOSAR DATA', err)
    }
}

export async function syncroData_AX_() {
    try {
        const data: false | sincroObject[] = await Preloaded_pedido_AX();
        if (data !== false) {
            console.log(`
||--------------------------------------------------------------------------------------------------------------------||
||                                  **** SE OBTUVO EL PRECARGADO (SIN ERRORES) ****                                   ||
||--------------------------------------------------------------------------------------------------------------------||`);
            if (data.length > 0) {
                for (let i = 0; data.length > i; i++) {
                    await validinert(data[i]);
                }
            }
        } else {
            console.log('||         ERROR AL OBTENER EL PRECARGADAO')
        }

    } catch (err) {
        console.log('||         ERROR AL EJECUTAR LA SINCRONIZACION : ', err);
    }
}