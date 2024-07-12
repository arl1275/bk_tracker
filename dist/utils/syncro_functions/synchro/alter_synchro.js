"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncroData_AX_ = void 0;
const preload_data_ax_1 = require("./preload_data_ax");
const localDB_config_1 = __importDefault(require("../../db/localDB_config"));
const simple_queries_synchro_1 = require("./simple_queries_synchro");
const syncro_functions_1 = require("./syncro_functions");
const alter_queries_synchro_1 = require("./alter_queries_synchro");
function UpdateOrNone_Pedido(pedido_) {
    return __awaiter(this, void 0, void 0, function* () {
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
            // THI PART LOOK FOR THE PEDIDO IN SPECIFIC, CASE IT DOES NOT EXIST WILL RETURN NULL OR NUMBER WHEATHER EXIST
            const idPDV = yield localDB_config_1.default.query((0, simple_queries_synchro_1.val_if_pedido_venta)(), [pedido_.pedido.PedidoVenta]);
            if (idPDV.rows.length > 0) {
                const pedidoventa_id = idPDV.rows[0].pedidoventa_id;
                console.log(`
||--------------------------------------------------------------------------------------------------------------------||
||    ACTUALIZANDO UN PEDIDO DE VENTA : ${pedido_.pedido.PedidoVenta}`);
                if (typeof pedidoventa_id === 'number') {
                    for (let i = 0; pedido_.data.length > i; i++) {
                        // THIS PART WILL LOOK FOR ALL THE FACTURAS OF THAT PEDIDOVENTAS
                        const detalleFacturas = pedido_.data[i];
                        const existFact = yield localDB_config_1.default.query((0, simple_queries_synchro_1.val_if_fact_exist)(), [detalleFacturas._factura_.Factura, pedido_.pedido.PedidoVenta]);
                        const existFact_id = existFact.rows[0].factura_id;
                        if (typeof existFact_id === 'number') { // if there is coincidence that means the preload and locadb data has no diferences
                            for (let j = 0; detalleFacturas.detalleFact.length > j; j++) {
                                const detalleAlbaran = detalleFacturas.detalleFact[j];
                                const existAlb = yield localDB_config_1.default.query((0, simple_queries_synchro_1.val_if_albaran)(), [detalleAlbaran._albaran_.Albaran, existFact_id]);
                                const existAlb_id = existAlb.rows[0].albaran_id;
                                if (typeof existAlb_id === 'number') {
                                    //console.log(`||     SIN MODIFICACIONES EN ALBARAN : ${detalleAlbaran._albaran_.Albaran} `);
                                    let count_cajas_agregadas = 0;
                                    for (let k = 0; detalleAlbaran._cajas_.length > k; k++) {
                                        const caja_ = detalleAlbaran._cajas_[k];
                                        const existCaja = yield localDB_config_1.default.query((0, simple_queries_synchro_1.val_if_caja)(), [caja_.Caja, existAlb_id]);
                                        const existCaja_id = existCaja.rows[0].caja_id;
                                        if (existCaja_id === null) {
                                            yield (0, alter_queries_synchro_1.quickBoxesInsert)(existAlb_id, caja_);
                                            count_cajas_agregadas += 1;
                                        }
                                    }
                                }
                                else {
                                    if (existFact_id)
                                        yield (0, alter_queries_synchro_1.quickAlbaranInsert)(existFact_id, pedido_.pedido, detalleAlbaran);
                                }
                            }
                        }
                        else if (existFact_id === null) { // in case is null, it means the factura does not exist of just has another name
                            if (typeof pedidoventa_id === 'number') {
                                //---------------------------------------------------------------------------------------------------------------//
                                // HERE IS WHERE WE NEED TO MAKE THE CHANGE,
                                // IF THE NEW FACTURA HAS THE SAME ALBARAN AND SAME LISTA-EMPAQUE, CHANGE THE ALBARAN FOR THE FACTURA
                                // THI IS IN THE FACTURAS TABLE, NOT IN THE ALBARAN TABLE
                                //---------------------------------------------------------------------------------------------------------------//
                                try {
                                    //await Full_Names_Update();                                
                                }
                                catch (error) {
                                    console.log('ERRO AL ACTUALIZAR FACTURA :: ', error);
                                }
                            }
                            else
                                console.log('|| ERROR EN EL ID DE FACTURA : ', existFact_id);
                        }
                    }
                }
                else {
                    console.log('|| NO SE PUDO OBTENER EL ID DEL PEDIDO');
                }
            }
            else {
                console.log('|| SIN RESULTADOS DEL ID DEL PEDIDO DE VENTA');
            }
        }
        catch (err) {
            console.log(`
        ||--------------------------------------------------------------------------||
        ||  EEROR AL MOMENTO DE SINCRONIZAR : ${err}
        ||--------------------------------------------------------------------------||`);
        }
        finally {
            console.log(`||--------------------------------------------------------------------------------------------------------------------||`);
            console.log(`||                                                 SINCRONIZACION FINALIZADA                                          ||`);
            console.log(`||--------------------------------------------------------------------------------------------------------------------||`);
        }
    });
}
function validinert(pedido) {
    return __awaiter(this, void 0, void 0, function* () {
        //-----------------------------------------------------------------------------------------------------------//
        // THIS FUNCTION IS TO VERIFY IS A PEDIDO ALREADY EXIST, IF EXIST THEN SEEK FOR UPDATES
        // IN CASE NO EXIST IT MAKES ALL FULL INSERTION
        //-----------------------------------------------------------------------------------------------------------//
        try {
            if (pedido) {
                const pedidoExist = yield localDB_config_1.default.query((0, simple_queries_synchro_1.val_if_pedido_venta)(), [pedido.pedido.PedidoVenta]);
                if (pedidoExist.rows.length > 0) {
                    //console.log('||     SE ESTA REVISANDO PEDIDO : ', pedido.pedido.PedidoVenta );
                    const pedidoventa_id = pedidoExist.rows[0].pedidoventa_id;
                    console.log('||  ', typeof pedidoventa_id === "number" ? ' EXISTE ESTE PEDIDO' : 'NO EXISTE ESTE PEDIDO\n');
                    if (typeof pedidoventa_id === 'number') {
                        // IF THE PEDIDO EXIST, WE WILL HANDLE IT IN ANOTHER FUNCTION TO CHECK ALL THE DATA OF THAT PEDIDO
                        yield UpdateOrNone_Pedido(pedido);
                    }
                    else if (pedidoventa_id === null) {
                        // IF THE PEDIDO DOES NOT EXIST, THEN WE'LL DO A NORMAL INSERTION
                        try {
                            const idPDV = yield (0, syncro_functions_1.insert_pedidoVenta)(pedido.pedido);
                            if (idPDV) {
                                // PRINT OF THE CONSOLE
                                console.log(`
||--------------------------------------------------------------------------------------------------------------------||
||                                          A NORMAL INSERTION                                                        ||                                 
||--------------------------------------------------------------------------------------------------------------------||
||  PEDIDO : ${pedido.pedido.PedidoVenta} 
||  CLIENTE : ${pedido.pedido.NombreCliente}
||  CUENTA : ${pedido.pedido.CuentaCliente}
||--------------------------------------------------------------------------------------------------------------------||`);
                                for (let i = 0; pedido.data.length > i; i++) { //pedido.data.length
                                    const detFactt = pedido.data[i];
                                    const id_factura = yield (0, syncro_functions_1.insert_factura_)(detFactt._factura_, idPDV);
                                    if (id_factura) {
                                        console.log(`||  FACTURA : ${detFactt._factura_.Factura}`);
                                        for (let j = 0; detFactt.detalleFact.length > j; j++) { // detFactt.detalleFact.length
                                            const detAlb = detFactt.detalleFact[j];
                                            const id_alb = yield (0, syncro_functions_1.insert_albaran_)(detAlb._albaran_, id_factura);
                                            if (id_alb) {
                                                console.log(`||  ALBARAN : ${detAlb._albaran_.Albaran}`);
                                                console.log(`||  DESTINO : ${detAlb._albaran_.calle}`);
                                                console.log('||--------------------------------------------------------------------------------------------------------------------||');
                                                for (let k = 0; detAlb._cajas_.length > k; k++) { //detAlb._cajas_.length
                                                    //if(k === 1) break;
                                                    const detCajas = detAlb._cajas_[k];
                                                    const inserted = yield (0, syncro_functions_1.insert_boxes_)(detCajas, id_alb);
                                                    if (inserted) {
                                                        console.log(`||     CAJA : ${detCajas === null || detCajas === void 0 ? void 0 : detCajas.Caja}        RUTA : ${detCajas === null || detCajas === void 0 ? void 0 : detCajas.ListaEmpaque}        CANTIDAD : ${detCajas === null || detCajas === void 0 ? void 0 : detCajas.cantidad}`);
                                                    }
                                                }
                                                console.log('||--------------------------------------------------------------------------------------------------------------------||');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch (err) {
                            console.log('||--------------------------------------------------------------------------------------------------------------------||');
                            console.log(`||     ERROR AL MOMENTO DE INSERTAR NORMALMANTE : ${err}`);
                        }
                    }
                }
                else {
                    console.log('||     NO HAY RESPUESTA DEL PEDIDO DE VENTA DEL SERVIDOR LOCAL');
                }
            }
            else {
                return false;
            }
        }
        catch (err) {
            console.log('||     ERROR AL DESGLOSAR DATA', err);
        }
        finally {
            console.log('||--------------------------------------------------------------------------------------------------------------------||');
        }
    });
}
function syncroData_AX_() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`
||--------------------------------------------------------------------------------------------------------------------||
||                                          **** ACTUALIZANDO NOMBRES ***                                             ||
||--------------------------------------------------------------------------------------------------------------------||\n`);
            yield (0, alter_queries_synchro_1.Full_Names_Update)();
            const data = yield (0, preload_data_ax_1.Preloaded_pedido_AX)();
            //console.log(data);
            if (data !== false) {
                console.log(`
||--------------------------------------------------------------------------------------------------------------------||
||                                  **** SE OBTUVO EL PRECARGADO (SIN ERRORES) ****                                   ||
||--------------------------------------------------------------------------------------------------------------------||`);
                if (data.length > 0) {
                    for (let i = 0; data.length > i; i++) {
                        yield validinert(data[i]);
                    }
                }
            }
            else {
                console.log('||         ERROR AL OBTENER EL PRECARGADAO');
            }
        }
        catch (err) {
            console.log('||         ERROR AL EJECUTAR LA SINCRONIZACION : ', err);
        }
    });
}
exports.syncroData_AX_ = syncroData_AX_;
