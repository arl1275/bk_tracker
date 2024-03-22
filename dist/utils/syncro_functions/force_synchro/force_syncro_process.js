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
exports.FORCE_insert_process_of_synchro = void 0;
const ax_config_1 = require("../../db/ax_config");
const force_syncro_queries_1 = require("./force_syncro_queries");
const syncro_functions_1 = require("../synchro/syncro_functions");
const FORCE_insert_process_of_synchro = (pedidoVenta, factura, albaran) => __awaiter(void 0, void 0, void 0, function* () {
    let info_force = {
        pedido: '',
        cliente: '',
        factura: '',
        albaran: '',
        ruta: '',
        cajas: 0
    };
    try {
        //------------------------------------------------------------------------------------------------------------//
        //                              THIS PART OBTAIN THE PEDIDOS FROM AX
        //------------------------------------------------------------------------------------------------------------//
        // Obtienen todos los pedidos de venta de este día (hoy)
        const pedidoventas_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_pedidoventas_F)(pedidoVenta));
        if (pedidoventas_.length = 1) {
            for (let i = 0; i < pedidoventas_.length; i++) {
                const pedido = pedidoventas_[i];
                if (pedido) {
                    info_force.cliente = pedido.NombreCliente;
                    const id_pedido = yield (0, syncro_functions_1.insert_pedidoVenta)(pedido);
                    console.log(`
||------------------------------------------------------------------------------------------------------------||
||    ESTE PEDIDO HA SIDO FORZADO SINCRONIZADO                                                                ||
||------------------------------------------------------------------------------------------------------------||
||    PEDIDO-VENTA : ${pedido.PedidoVenta}                                                                    
||    CLIENTE : ${pedido.NombreCliente}                                                                       
||    CUENTA : ${pedido.CuentaCliente}                                                                        
||------------------------------------------------------------------------------------------------------------||`);
                    if (id_pedido) {
                        //------------------------------------------------------------------------------------------------------------//
                        //    THIS PART OBTAIN THE SPECIFIC FACTURAS OF THE PEDIDOS DE VENTA IF THE REQ COMES WITH FACT OR ALBARAN
                        //------------------------------------------------------------------------------------------------------------//
                        // THIS PART INSERT ONLY ONE FACTURA
                        if (factura != '' && albaran === '') {
                            console.log('||         INGRESO A INSERCION POR FACTURA : ', factura);
                            let fact = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F)(pedido.PedidoVenta, factura));
                            if (fact) {
                                const id_factura = yield (0, syncro_functions_1.insert_factura_)(fact[0], id_pedido);
                                if (id_factura) {
                                    console.log(`||         FACTURA : ${fact[0].Factura}`);
                                    info_force.factura = fact[0].Factura;
                                    const albarans_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_albarans_of_a_factura_F)(fact[0].Factura));
                                    for (let k = 0; k < albarans_.length; k++) {
                                        const _albaran = albarans_[k];
                                        const id_albaran = yield (0, syncro_functions_1.insert_albaran_)(_albaran, id_factura);
                                        if (id_albaran) {
                                            console.log(`||                 ALBARAN : ${_albaran.Albaran}   DESTINO : ${_albaran.ciudad}`);
                                            const cajas_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_boxes_of_an_albaran_F)(_albaran.Albaran, pedido.PedidoVenta)); // get all the cajas of one albaran
                                            for (let l = 0; l < cajas_.length; l++) {
                                                const _caja = cajas_[l];
                                                yield (0, syncro_functions_1.insert_boxes_)(_caja, id_albaran);
                                                console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                console.log('|| FACTURA NO EXISTE EN AX');
                            }
                        }
                        // THIS PART IF TO INSERT ONLY ONE ALBARAN
                        else if (albaran != '' && factura === '') {
                            const albaran_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_albaran_of_albaran_inserted_as_factura_F)(albaran, pedido.PedidoVenta));
                            if (albaran_.length > 0) {
                                const fact = { Factura: albaran_[0].Albaran };
                                const id_fact = yield (0, syncro_functions_1.insert_factura_)(fact, id_pedido);
                                if (id_fact) {
                                    console.log('||         INGRESO A INSERCION POR ALBARAN : ', fact);
                                    const id_albaran = yield (0, syncro_functions_1.insert_albaran_)(albaran_[0], id_fact);
                                    if (id_albaran) {
                                        console.log(`||                 ALBARAN : ${albaran_[0].Albaran}   DESTINO : ${albaran_[0].ciudad}`);
                                        const cajas_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_boxes_of_an_albaran_F)(albaran_[0].Albaran, pedido.PedidoVenta)); // get all the cajas of one albaran
                                        for (let l = 0; l < cajas_.length; l++) {
                                            const _caja = cajas_[l];
                                            yield (0, syncro_functions_1.insert_boxes_)(_caja, id_albaran);
                                            console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
                                        }
                                    }
                                }
                                else {
                                    console.log('||         NO SE PUDO INGRESAR EL ALBARAN');
                                }
                            }
                        }
                        // THIS PART IS TO SYNCRO ALL THE PEDIDOVENTA
                        else if (factura == '' && albaran === '') {
                            console.log('||         INGRESO A INSERCION DE PEDIDO COMPLETO : ', pedidoVenta);
                            const facturas_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_facts_of_a_pedidoVenta_F)(pedido.PedidoVenta));
                            for (let j = 0; j < facturas_.length; j++) {
                                const fact = facturas_[j];
                                if (fact) {
                                    const id_factura = yield (0, syncro_functions_1.insert_factura_)(fact, id_pedido); // insert the factura and return the id
                                    if (id_factura) {
                                        let albaran_;
                                        if (fact.Factura.startsWith('AL')) { // if an albaran was inserted as factura, the get the albaran of that albaran
                                            console.log(`||         INSERTO COMO ALBARAN : ${fact.Factura}`);
                                            albaran_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_albaran_of_albaran_inserted_as_factura_F)(fact.Factura, pedido.PedidoVenta));
                                        }
                                        else {
                                            console.log(`||         FACTURA : ${fact.Factura}`);
                                            albaran_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_albarans_of_a_factura_F)(fact.Factura)); // gets all the albaranes of one factura
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
                                                const cajas_ = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_boxes_of_an_albaran_F)(_albaran.Albaran, pedido.PedidoVenta)); // get all the cajas of one albaran
                                                for (let l = 0; l < cajas_.length; l++) {
                                                    const _caja = cajas_[l];
                                                    yield (0, syncro_functions_1.insert_boxes_)(_caja, id_albaran);
                                                    console.log(`||                 CAJA :  ${_caja.Caja}   CANTIDAD : ${_caja.cantidad}    RUTA : ${_caja.ListaEmpaque} `);
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
                }
                else {
                    console.log('||     PEDIDO DE VENTA NO RECONOCIDO : ', pedidoventas_);
                }
            }
        }
        else {
            console.log('||  PEDIDO DE VENTA TIENE MAS DE UNA COINCIDENCIA O NO EXISTE EN AX');
        }
    }
    catch (err) {
        console.log('||     ERROR DURANTE LA SINCRONIZACIÓN FORZADA : ', err);
    }
});
exports.FORCE_insert_process_of_synchro = FORCE_insert_process_of_synchro;
