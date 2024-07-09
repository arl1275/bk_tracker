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
exports.UpdateLogs = exports.createLog = exports.GetPRELOADRegister = void 0;
const localDB_config_1 = __importDefault(require("../db/localDB_config"));
//this is to get the preload of one register
const GetPRELOADRegister = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM logs WHERE id = '${id}'`;
        const result = yield localDB_config_1.default.query(query);
        return result ? result : [false, { message: 'NO EXISTE ESE VALOR EN LOGS' }];
    }
    catch (err) {
        console.log('|| hubo un error al cargar precargado :: ', err);
        return [false, { message: 'ERROR al obtener el precargado de log' }];
    }
});
exports.GetPRELOADRegister = GetPRELOADRegister;
// This is to create a LOG
const createLog = (detalleCreacion) => {
    return `INSERT INTO logs (create_at, detalle_creacion) values (CURRENT_TIMESTAMP AT TIME ZONE 'UTC-6', ${detalleCreacion});`;
};
exports.createLog = createLog;
//this is to update the log of one register
const UpdateLogs = (IdToUpdate, details) => {
    return `
    UPDATE logs 
    SET detalle_declaracion_envio = ${details.detalle_declaracion_envio} , 
    detalle_transito = ${details.detalle_transito},
    detalle_entrega = ${details.detalle_entrega},
    detalle_sincronizado = ${details.detalle_sincronizado},
    detalle_de_pospuesto = ${details.detalle_pospuesto},
    detalle_cancelacion = ${details.detalle_cancelacion}
    WHERE id = ${IdToUpdate}
    `;
};
exports.UpdateLogs = UpdateLogs;
