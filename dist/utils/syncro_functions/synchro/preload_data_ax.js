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
exports.Preloaded_pedido_AX = void 0;
const ax_config_1 = require("../../db/ax_config");
const localDB_config_1 = __importDefault(require("../../db/localDB_config"));
const simple_queries_synchro_1 = require("./simple_queries_synchro");
//||--------------------------------------------------------------------------------------------------------------------||
//||                          THIS FUNCTION RETURNS A PRELOADED OBJECT TO SINCRO PROCESS
//||--------------------------------------------------------------------------------------------------------------------||
//||            THIS FUNCTION HAS AS WELL, THE FUNCTION TO UPDATE DE DECLARACIONS OF ENVIO                              ||
//||--------------------------------------------------------------------------------------------------------------------||
const Preloaded_pedido_AX = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // this part if to update the declaraciones de envio
        const query_update_decenv = 'SELECT * FROM automatic_close_decenv();';
        yield localDB_config_1.default.query(query_update_decenv);
        //----------------------------------------------------------------------------------------------------------------------------------------------------------//
        let preloadData = []; // this is to save all the details of all pedidos de venta
        let pdventas_ = []; // this is to save the details of all pedidos de venta
        pdventas_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_pedidoventas)());
        if (pdventas_.length > 0) {
            console.log('||--------------------------------------------------------------------------------------------------------------------||');
            console.log('||                                                 GENERANDO LA PRECARGA                                              ||');
            console.log('||--------------------------------------------------------------------------------------------------------------------||');
            for (let i = 0; i < pdventas_.length; i++) {
                let pedido = pdventas_[i]; // this is to save one pedidodeVenta to be process
                let facturas_ = []; // this is to save all the facturas of the pedidoVentas that is going to process
                let detalleFactura = []; // this is to save the details of the facturas of one pedidoVentas
                //console.log('|| PEDIDO : ', pedido.PedidoVenta, ' :: ', pedido.NombreCliente );
                facturas_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_facts_of_a_pedidoVenta)(pedido.PedidoVenta));
                if (facturas_.length > 0) {
                    for (let j = 0; j < facturas_.length; j++) {
                        let albaranes_ = []; // this is to save all albaranes of one factura to be process
                        let detalleAlbaran = []; // this is to save the detail of one albaran
                        const fact = facturas_[j]; // this is to save one factura to be process
                        //console.log(`||    FACTURA : ${fact.Factura}`)
                        if (fact.Factura.startsWith('AL')) {
                            let alb_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_albaran_of_albaran_inserted_as_factura)(fact.Factura, pedido.PedidoVenta));
                            albaranes_.push(alb_[0]);
                        }
                        else {
                            let alb_ = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_albarans_of_a_factura)(fact.Factura, pedido.PedidoVenta));
                            for (let a = 0; alb_.length > a; a++) {
                                albaranes_.push(alb_[a]);
                            }
                        }
                        // FROM HERE STARTS THE DETAILS OF THE ALBARAN
                        if (albaranes_.length > 0) {
                            for (let k = 0; k < albaranes_.length; k++) {
                                let x = albaranes_[k];
                                const caja_s = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.query_get_boxes_of_an_albaran)(x.Albaran));
                                //console.log(`||      ALBARANES : ${x.Albaran}`)
                                //console.log('||     DETALLE DE CAJAS ');
                                if (caja_s.length > 0) {
                                    //console.log('|| CAJA :: ', caja_s);
                                    let detail_oneAlb = { _albaran_: albaranes_[k], _cajas_: caja_s };
                                    detalleAlbaran.push(detail_oneAlb);
                                }
                                else {
                                    //console.log(`||     NO HAY CAJAS DE ESTE ALBARAN : ${x.Albaran}`);
                                    return false;
                                }
                            }
                            //console.log(`||--------------------------------------------------------------------------------------------------------------------||`)
                        }
                        else {
                            console.log('||     NO HAY ALBARANES PRECARGADOS');
                            return false;
                        }
                        const detailOneFact = { _factura_: fact, detalleFact: detalleAlbaran };
                        detalleFactura.push(detailOneFact);
                    }
                }
                else {
                    console.log('||     NO HAY FACTURAS PRECARGADAS');
                    return false;
                }
                const Detalle_pedido = { pedido: pedido, data: detalleFactura };
                preloadData.push(Detalle_pedido);
            }
            return preloadData;
        }
        else {
            console.log('||    NO HAY PEDIDOS, SIN PEDIDOS EN COLA EN PRECARGA');
            return false;
        }
    }
    catch (err) {
        console.log('||     ERROR AL PRECARGAR PEDIDOS ==> ', err);
        return false;
    }
});
exports.Preloaded_pedido_AX = Preloaded_pedido_AX;
