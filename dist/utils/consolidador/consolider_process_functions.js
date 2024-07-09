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
exports.PreLoadConsolidation = exports.UnConsolidate = exports.Consolidador = void 0;
const Consolidador = (values) => {
    //THIS FUNCTION IS TO IDENTIFY CONSOLIDATIONS OF REGISTERS.
};
exports.Consolidador = Consolidador;
const UnConsolidate = (values) => {
    // THIS FUNCION IS TO REVERB CONSOLIDATINS PREVIUSLY MAKED
};
exports.UnConsolidate = UnConsolidate;
const PreLoadConsolidation = (factura) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (factura != null && factura.length > 0) {
        }
        else {
            console.log('|| Error al cargar el precargado...');
            return [false, { message: 'Error al generar el precargado' }];
        }
    }
    catch (err) {
        console.log('|| Error al generar precargado de consolidados');
        return [false, { message: 'Error al generar el precargado' }];
    }
});
exports.PreLoadConsolidation = PreLoadConsolidation;
