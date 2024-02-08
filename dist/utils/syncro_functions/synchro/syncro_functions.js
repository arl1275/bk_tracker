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
exports.insert_boxes_ = exports.insert_albaran_ = exports.insert_factura_ = exports.insert_pedidoVenta = exports.val_insert_facturas_nuevas = exports.val_insert_pedidoventas_nuevas = void 0;
const localDB_config_1 = __importDefault(require("../../db/localDB_config"));
const simple_queries_synchro_1 = require("./simple_queries_synchro");
//------------------------------------------------------------------------------//
//              THIS FILE HAVE THE FUNCTIONS TO SYNCRO FACTS WITH AX            //
//------------------------------------------------------------------------------//
const val_insert_pedidoventas_nuevas = (id_) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const exist = false;
            localDB_config_1.default.query((0, simple_queries_synchro_1.val_if_pedido_venta)(), [id_], (err, result) => {
                if (err) {
                    console.error('Error executing query ===> ', err);
                    reject(err); // Reject the promise in case of an error
                }
                else {
                    if (result.rows[0].exists === false) {
                        resolve(false); // Resolve the promise with false
                    }
                    else {
                        //console.log('FACTURA YA EXISTE', data);
                        resolve(true); // Resolve the promise with true
                    }
                }
            });
        }
        catch (err) {
            console.log('NO SE PUDO VALIDAR LA FACTURA');
            resolve(true); // Resolve the promise with true in case of an exception
        }
    });
});
exports.val_insert_pedidoventas_nuevas = val_insert_pedidoventas_nuevas;
const val_insert_facturas_nuevas = (factura, pedido) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            localDB_config_1.default.query((0, simple_queries_synchro_1.val_if_fact_exist)(), [factura, pedido], (err, result) => {
                if (err) {
                    console.error('Error executing query : ', err);
                    reject(err); // Reject the promise in case of an error
                }
                else {
                    if (result.rows[0].exists === false) {
                        resolve(false); // Resolve the promise with false
                    }
                    else {
                        //console.log('FACTURA YA EXISTE', data);
                        resolve(true); // Resolve the promise with true
                    }
                }
            });
        }
        catch (err) {
            console.log('NO SE PUDO VALIDAR LA FACTURA');
            resolve(true); // Resolve the promise with true in case of an exception
        }
    });
});
exports.val_insert_facturas_nuevas = val_insert_facturas_nuevas;
const insert_pedidoVenta = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        localDB_config_1.default.query((0, simple_queries_synchro_1.insert_pedido_venta)(), [data.PedidoVenta, data.NombreCliente, data.CuentaCliente], (err, result) => {
            if (!err && result.rows.length > 0 && result.rows[0].id) {
                const val = result.rows[0].id;
                resolve(val); // Resolve with the ID
            }
            else {
                console.log('NO SE PUDO INGRESAR PEDIDO_VENTA :', data);
                console.log('ERROR: ', err);
                reject(err); // Reject with the error
            }
        });
    });
});
exports.insert_pedidoVenta = insert_pedidoVenta;
const insert_factura_ = (data, id_) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        localDB_config_1.default.query((0, simple_queries_synchro_1.insert_factura)(), [data.Factura, id_], (err, result) => {
            if (!err && result.rows.length > 0 && result.rows[0].id) {
                const val = result.rows[0].id;
                resolve(val); // Resolve with the ID
            }
            else {
                console.log('NO SE PUDO INGRESAR LA FACUTRA :', data);
                reject(err); // Reject with the error
            }
        });
    });
});
exports.insert_factura_ = insert_factura_;
const insert_albaran_ = (data, id_) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        localDB_config_1.default.query((0, simple_queries_synchro_1.insert_albaran)(), [data.Albaran, data.Pais, data.Departamento, data.ciudad,
            data.calle, data.ubicacion, data.empacador, id_], (err, result) => {
            if (err) {
                console.log('ALBARAN NO SE PUDO INGRESAR : ', data, ' error : ', err);
                reject(err); // Reject with error
            }
            else {
                let val = result.rows[0].id;
                resolve(val); // Resolve with the ID
            }
        });
    });
});
exports.insert_albaran_ = insert_albaran_;
const insert_boxes_ = (data, id_) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        localDB_config_1.default.query((0, simple_queries_synchro_1.insert_boxes)(), [data.ListaEmpaque, data.Caja, data.NumeroCaja, data.cantidad, id_], (err, result) => {
            if (err) {
                console.error('Error inserting box: ', err);
                reject(err); // Reject the promise if there's an error
            }
            else {
                resolve(true); // Resolve the promise indicating successful insertion
            }
        });
    });
});
exports.insert_boxes_ = insert_boxes_;
