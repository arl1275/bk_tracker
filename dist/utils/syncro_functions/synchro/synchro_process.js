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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NORMAL_insert_process_of_synchro = void 0;
const ax_config_1 = require("../../db/ax_config");
const simple_queries_synchro_1 = require("./simple_queries_synchro");
const syncro_functions_1 = require("./syncro_functions");
const NORMAL_insert_process_of_synchro = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //------------------------------------------------------------------------------------------------------------//
        //                              THIS PART OBTAIN THE PEDIDOS FROM AX
        //------------------------------------------------------------------------------------------------------------//
        const pedidoventas_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_pedidoventas)());
        if (pedidoventas_.length > 0) {
            for (let i = 0; i < pedidoventas_.length; i++) {
                const pedido = pedidoventas_[i];
                const exist_pedido = yield (0, syncro_functions_1.val_insert_pedidoventas_nuevas)(pedido.PedidoVenta);
                if (exist_pedido === false) {
                    const id_pedido = yield (0, syncro_functions_1.insert_pedidoVenta)(pedido);
                    console.log(`
||------------------------------------------------------------------------------------------------------------||
||    PEDIDO-VENTA : ${pedido.PedidoVenta}                                                                    
||    CLIENTE : ${pedido.NombreCliente}                                                                       
||    CUENTA : ${pedido.CuentaCliente}                                                                        
||------------------------------------------------------------------------------------------------------------||`);
                    if (id_pedido) {
                        //------------------------------------------------------------------------------------------------------------//
                        //                       THIS PART OBTAIN THE SPECIFIC FACTURAS OF THE PEDIDOS DE VENTA
                        //------------------------------------------------------------------------------------------------------------//
                        const facturas_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_facts_of_a_pedidoVenta)(pedido.PedidoVenta));
                        for (let j = 0; j < facturas_.length; j++) {
                            const fact = facturas_[j];
                            if (fact) {
                                const exist_factura = yield (0, syncro_functions_1.val_insert_facturas_nuevas)(fact.Factura, pedido.PedidoVenta); // values if the factura already exist in LOCAL_DB
                                if (exist_factura === false) {
                                    const id_factura = yield (0, syncro_functions_1.insert_factura_)(fact, id_pedido); // insert the factura and return the id
                                    if (id_factura) {
                                        //----------------------------------------------------------------------------------------------------//
                                        //                  THIS IS TO HANDLE THE ALBARANES THAT DOES NOT HAVE FACTURA                        //
                                        //----------------------------------------------------------------------------------------------------//
                                        let albaran_;
                                        if (fact.Factura.startsWith('AL')) { // if an albaran was inserted as factura, the get the albaran of that albaran
                                            console.log(`||         INSERTO COMO ALBARAN : ${fact.Factura}`);
                                            albaran_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_albaran_of_albaran_inserted_as_factura)(fact.Factura, pedido.PedidoVenta));
                                        }
                                        else {
                                            console.log(`||         FACTURA : ${fact.Factura}`);
                                            albaran_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_albarans_of_a_factura)(fact.Factura)); // gets all the albaranes of one factura
                                        }
                                        //----------------------------------------------------------------------------------------------------//
                                        for (let k = 0; k < albaran_.length; k++) {
                                            const _albaran = albaran_[k];
                                            const id_albaran = yield (0, syncro_functions_1.insert_albaran_)(_albaran, id_factura); // insert albaran and return id
                                            //------------------------------------------------------------------------------------------------------------//
                                            //                       THIS PART OBTAIN THE SPECIFIC CAJAS OF THE FACTURA                                   //
                                            //------------------------------------------------------------------------------------------------------------//
                                            if (id_albaran) {
                                                console.log(`||                 ALBARAN : ${_albaran.Albaran}   DESTINO : ${_albaran.ciudad}`);
                                                const cajas_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_boxes_of_an_albaran)(_albaran.Albaran)); // get all the cajas of one albaran
                                                for (let l = 0; l < cajas_.length; l++) {
                                                    const _caja = cajas_[l];
                                                    yield (0, syncro_functions_1.insert_boxes_)(_caja, id_albaran);
                                                    console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                console.log('// ERROR : FACTURA TIENEN CAMPO VACIO');
                            }
                        }
                        console.log('||------------------------------------------------------------------------------------------------------------||');
                    }
                }
                else {
                    console.log('// PEDIDO DE VENTA YA EXISTE : ', pedido.PedidoVenta);
                }
            }
        }
        else {
            console.log('NO SE PUDO OBTENER LA LISTA DE PEDIDOS DE VENTA');
        }
    }
    catch (err) {
        console.log('ERROR DURANTE LA SINCRONIZACIÓN : ', err);
    }
});
exports.NORMAL_insert_process_of_synchro = NORMAL_insert_process_of_synchro;
