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
exports.ForceSynchro = void 0;
const force_syncro_process_1 = require("./force_syncro_process");
function ForceSynchro(pedido, factura, albaran) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, force_syncro_process_1.FORCE_insert_process_of_synchro)(pedido, factura, albaran);
        }
        catch (err) {
            console.log('|| ERROR AL FORZAR SINCRONIZADO : ', err);
        }
    });
}
exports.ForceSynchro = ForceSynchro;
