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
exports.UpdateFacturaLater = void 0;
const localDB_config_1 = __importDefault(require("../../db/localDB_config"));
const UpdateFacturaLater = (props) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const query = 'select * from update_referencia_factura( $1, $2, $3 )';
            if (Array.isArray(props)) {
                for (let i = 0; i < props.length; i++) {
                    const element = props[i];
                    localDB_config_1.default.query(query, [element.id_pedi, element.id_fact, element.factura], (err, result) => {
                        if (err) {
                            console.log('||--|| NO SE PUDO ACTUALIZAR LA FACTURA ||--||');
                        }
                        else {
                            console.log('||--|| SE HA ACTUALIZADO LA FACUTRA ||--||');
                        }
                    });
                }
            }
        }
        catch (err) {
            console.log('||--||  NO SE PUDO ACTUALIZAR LAS FACTURAS ||--||');
        }
    });
});
exports.UpdateFacturaLater = UpdateFacturaLater;
