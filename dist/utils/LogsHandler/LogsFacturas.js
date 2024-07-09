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
exports.UpdateFacturasLog = void 0;
const Logs_queries_1 = require("./Logs_queries");
const UpdateFacturasLog = (id_, details) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, Logs_queries_1.GetPRELOADRegister)(id_);
        if (!result) {
            return [false, { message: 'NO exite ese registro' }];
        }
        else if (typeof result[0] != 'boolean') {
            let NewValues;
            result.array.forEach((item) => {
            });
        }
    }
    catch (err) {
        console.log('|| ERROR al actualizar log :: ', err);
        return [false, { message: 'ERROR al actualizar LOG' }];
    }
});
exports.UpdateFacturasLog = UpdateFacturasLog;
