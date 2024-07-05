"use strict";
//-------------------------------------------------------------------------------//
//  THIS FILE DEFINE THE FUNCTIONS THAT MAKE A QUICK INSERT
//  THIS IS USED IN THE ALTER SYNCRO
//-------------------------------------------------------------------------------//
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
exports.Full_Names_Update = exports.quickBoxesInsert = exports.quickAlbaranInsert = exports.quickFacturaInsert = void 0;
const ax_config_1 = require("../../db/ax_config");
const localDB_config_1 = __importDefault(require("../../db/localDB_config"));
const force_syncro_queries_1 = require("../force_synchro/force_syncro_queries");
const syncro_functions_1 = require("../synchro/syncro_functions");
const simple_queries_synchro_1 = require("./simple_queries_synchro");
function quickFacturaInsert(id_pedido, pedido_, facturaDetalle) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let factura = '', albaran = '';
            let pedido = pedido_;
            if (facturaDetalle._factura_.Factura.startsWith('AL-')) {
                albaran = facturaDetalle._factura_.Factura;
            }
            else {
                factura = facturaDetalle._factura_.Factura;
            }
            if (factura != '' && albaran === '') {
                console.log('||         INGRESO A INSERCION POR FACTURA : ', factura);
                let fact = yield (0, ax_config_1.executeQuery)((0, force_syncro_queries_1.query_get_fact_of_a_pedidoVenta_UNIK_RESPONSE_F)(pedido.PedidoVenta, factura));
                if (fact) {
                    const id_factura = yield (0, syncro_functions_1.insert_factura_)(fact[0], id_pedido);
                    if (id_factura) {
                        console.log(`||         FACTURA : ${fact[0].Factura}`);
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
        }
        catch (err) {
            console.log(`||    ERROR AL ACTUALIZAR FACTURAS : ${err}`);
        }
    });
}
exports.quickFacturaInsert = quickFacturaInsert;
function quickAlbaranInsert(id_factura, pedido, detalleAlbaran) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _albaran = detalleAlbaran._albaran_;
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
        catch (err) {
            console.log('|| ERROR AL AGREGAR UN ALBARAN');
        }
    });
}
exports.quickAlbaranInsert = quickAlbaranInsert;
function quickBoxesInsert(id_albaran, detalleCaja) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inserted = yield (0, syncro_functions_1.insert_boxes_)(detalleCaja, id_albaran);
            if (inserted) {
                console.log(`||                 CAJA AGREGADA :  ${detalleCaja.Caja}   CANTIDAD : ${detalleCaja.cantidad}    RUTA : ${detalleCaja.ListaEmpaque} `);
            }
        }
        catch (err) {
            console.log('|| ERROR AL AGREGAR UN ALBARAN', err);
        }
    });
}
exports.quickBoxesInsert = quickBoxesInsert;
//-------------------------------------------------------------------------------------------------------------------//
//                      THIS FUNCTION LOOK FOR ANY KIND OF UPDATE IN NAMES OF FACTURAS
//-------------------------------------------------------------------------------------------------------------------//
function Full_Names_Update() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const facturasHead = yield localDB_config_1.default.query((0, simple_queries_synchro_1.get_head_albaranesAsFact)());
            const FactsToUpdate = facturasHead.rows;
            if (FactsToUpdate.length > 0) {
                for (let x = 0; FactsToUpdate.length > x; x++) {
                    const Factura = FactsToUpdate[x];
                    const AXhead = yield (0, ax_config_1.executeQuery)((0, simple_queries_synchro_1.get_Ax_head_albaranesFacturas)(Factura.albaran, Factura.lista_empaque, Factura.pedidoventa));
                    if (AXhead.length > 0) {
                        for (let y = 0; AXhead.length > y; y++) {
                            //console.log('||     DATA ::: LOCAL : ', Factura.factura,'||  AX : ', AXhead[y].factura)
                            if (Factura.factura != AXhead[y].factura) {
                                yield localDB_config_1.default.query((0, simple_queries_synchro_1.change_factura_name)(), [AXhead[y].factura, Factura.id_factura]);
                                console.log(`||     SE ACTUALIZO EL NOMBRE DE FACUTA :: ${Factura.factura} ===> ${AXhead[y].factura}`);
                            }
                            else {
                                return [false, { message: '|| ESTA FACTURA NO TIENE ACTUALIZACIONES' }];
                            }
                        }
                    }
                    else {
                        console.log('|| FACTURA SIN ACTUALIZACION DE FACTURA');
                    }
                }
            }
            else {
                return [false, { message: '|| SIN FACTURAS PARA ACTUALIZAR' }];
            }
        }
        catch (error) {
            console.log(`|| ERROR AL BUSCAR ACTUALIZACIONES :: ${error}`);
        }
        finally {
            console.log('||                                              FINALIZACION DE ACTUALIZACIONES                                       ||');
            console.log('||--------------------------------------------------------------------------------------------------------------------||');
        }
    });
}
exports.Full_Names_Update = Full_Names_Update;
