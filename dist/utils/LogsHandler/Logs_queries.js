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
exports.UPLOADER_LOG = exports.CrearLog_returning_id = exports.UpdateLogs = exports.createLog = exports.GetPRELOADRegister = void 0;
const localDB_config_1 = __importDefault(require("../db/localDB_config"));
//this is to get the preload of one register
const GetPRELOADRegister = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM logs WHERE id = '${id}'`;
        const result = yield localDB_config_1.default.query(query);
        return result ? result.rows[0] : [false, { message: 'NO EXISTE ESE VALOR EN LOGS' }];
    }
    catch (err) {
        console.log('|| hubo un error al cargar precargado :: ', err);
        return [false, { message: 'ERROR al obtener el precargado de log' }];
    }
});
exports.GetPRELOADRegister = GetPRELOADRegister;
// This is to create a LOG
const createLog = () => {
    return `INSERT INTO logs (created_at, detalle_creacion) values (CURRENT_TIMESTAMP AT TIME ZONE 'UTC-6', $1) RETURNING id;`;
};
exports.createLog = createLog;
const UpdateDecClaracionEnvio = 'UPDATE logs SET detalle_declaracion_envio = $1 WHERE id = $2;';
const UpdateDetalleTransito = 'UPDATE logs SET detalle_transito = $1 WHERE id = $2;';
const UpdateDetalleEntrega = 'UPDATE logs SET detalle_entrega = $1 WHERE id = $2;';
const UpdateDetalleSincronizado = 'UPDATE logs SET detalle_sincronizado = $1 WHERE id = $2;';
const UpdateDetallePospuesto = 'UPDATE logs SET detalle_pospuesto = $1 WHERE id = $2;';
const UpdateDetalleCancelacion = 'UPDATE logs SET detalle_cancelacion = $1 WHERE id = $2;';
//this is to update the log of one register
const UpdateLogs = () => {
    return `
    UPDATE logs 
    SET detalle_declaracion_envio = $2,
    detalle_transito = $3,
    detalle_entrega = $4,
    detalle_sincronizado = $4,
    detalle_de_pospuesto = $5,
    detalle_cancelacion = $6,
    WHERE id = $1;
    `;
};
exports.UpdateLogs = UpdateLogs;
// THIS IS TO CREATE A LOG REGISTER, AND RETURN THE ID OR 0
// this is not exactly a query, but i didn't know, where should i wrote it out.
// this funtion works to forceSynchro and normalSynchro.
const CrearLog_returning_id = (factura, Forzado) => __awaiter(void 0, void 0, void 0, function* () {
    let idLog = 0;
    //console.log(' PARA forzar :: ',factura, Forzado )
    if (factura.startsWith('AL-')) {
        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19); // Formato: YYYY-MM-DD HH:MM:SS
        const query = (0, exports.createLog)();
        const detalle = `${formattedDate} : ${Forzado ? `ALBARAN : ${factura}, Creado e insertado FORZADO` : 'ALBARAN, Creado e insertado NORMAL'}`;
        try {
            const res = yield localDB_config_1.default.query(query, [detalle]);
            console.log('Valor obtenido :: ', res.rows[0].id, typeof res.rows[0].id);
            idLog = typeof res.rows[0].id === 'number' ? res.rows[0].id : 0;
        }
        catch (err) {
            console.error('Error executing query', err);
        }
    }
    else {
        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19); // Formato: YYYY-MM-DD HH:MM:SS
        const query = (0, exports.createLog)();
        const detalle = `${formattedDate} : ${Forzado ? 'FACTURA, Creada e insertada FORZADO' : 'FACTURA, Creado e insertado NORMAL'}`;
        try {
            const res = yield localDB_config_1.default.query(query, [detalle]);
            idLog = typeof res.rows[0].id === 'number' ? res.rows[0].id : 0;
        }
        catch (err) {
            console.error('Error executing query', err);
        }
    }
    return idLog;
});
exports.CrearLog_returning_id = CrearLog_returning_id;
const Type_ = (selecction) => {
    if (selecction.startsWith('Detalle declaracion')) {
        return UpdateDecClaracionEnvio;
    }
    else if (selecction.startsWith('Detalle transito')) {
        return UpdateDetalleTransito;
    }
    else if (selecction.startsWith('Detalle entrega')) {
        return UpdateDetalleEntrega;
    }
    else if (selecction.startsWith('Detalle sincronizado')) {
        return UpdateDetalleSincronizado;
    }
    else if (selecction.startsWith('Detalle pospuesto')) {
        return UpdateDetallePospuesto;
    }
    else if (selecction.startsWith('Detalle cancelacion')) {
        return UpdateDetalleCancelacion;
    }
};
//  THIS FUNTION IS TO SELECT AND UPDATE AN ESPECIFIC FIELD IN LOGS TABLE
const UPLOADER_LOG = (id_factura, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let IdLog = 0;
        let ValorIdLog = yield localDB_config_1.default.query('SELECT id_logs FROM facturas WHERE id = $1', [id_factura]);
        IdLog = typeof ValorIdLog.rows[0].id_logs === 'number' ? ValorIdLog.rows[0].id_logs : 0;
        const query = Type_(message);
        if (typeof query === 'string' && IdLog > 0) {
            const result = yield localDB_config_1.default.query(query, [message, IdLog]);
        }
        else {
            console.log('|| ESTE VALOR NO ES VALIDO PARA CONSOLIDADO DE LOGS :: ', typeof query === 'string', IdLog);
        }
    }
    catch (err) {
        console.log('||     Error al consolidar detalles : ', err);
    }
});
exports.UPLOADER_LOG = UPLOADER_LOG;
