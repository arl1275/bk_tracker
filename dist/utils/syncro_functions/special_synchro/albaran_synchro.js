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
exports.UpdateFacturasChanges = void 0;
const localDB_config_1 = __importDefault(require("../../db/localDB_config"));
const ax_config_1 = require("../../db/ax_config");
const albaran_query_1 = require("./albaran_query");
const utils_1 = require("../../handle_passwords/utils");
const update_functions_1 = require("./update_functions");
const UpdateFacturasChanges = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dataAX = [];
        let dataLocal = [];
        let data_changes = [];
        dataAX = yield (0, ax_config_1.executeQuery)((0, albaran_query_1.get_update_info_fromAX)()); // || pedidoventa | factura | albaran ||
        dataLocal = localDB_config_1.default.query((0, albaran_query_1.get_ids_pedidos_to_update)()); // || pedido_id | p.pedidoventa | factura_id | f.factura | albaran_id | a.albaran || 
        for (let i = 0; i < dataLocal.length; i++) {
            const localItem = dataLocal[i];
            for (let j = 0; j < dataAX.length; j++) {
                const axItem = dataAX[j];
                if (axItem.pedidoventa === localItem.pedidoventa && axItem.albaran === localItem.albaran && localItem.factura !== axItem.factura) {
                    data_changes.push({
                        id_pedi: localItem.pedido_id,
                        pedidoventas: localItem.pedidoventa,
                        id_fact: localItem.factura_id,
                        factura: axItem.factura,
                        albara_: localItem.albaran,
                        id_alba: localItem.albaran_id
                    });
                    break;
                }
            }
        }
        if (data_changes.length > 0) {
            yield (0, update_functions_1.UpdateFacturaLater)(data_changes);
        }
        else {
            console.log(`
        ||----------------------------------------------------------------------------------------------------||
        ||                NO SE REALIZARON ACTUALIZACIONES DE FACTURAS : ${(0, utils_1.obtenerFechaActual)()}              ||
        ||----------------------------------------------------------------------------------------------------||
        `);
        }
    }
    catch (err) {
        console.log(`
        ||----------------------------------------------------------------------------------------------------||
        ||                             ERROR AL ACTUALIZAR DATOS DE LAS FACTURAS                              ||
        ||----------------------------------------------------------------------------------------------------||
        `);
    }
});
exports.UpdateFacturasChanges = UpdateFacturasChanges;
