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
exports.putDecEnv_service = exports.getDecEnvios_service = exports.getFacts_one_dec = exports.putDecEnv_serive = exports.getDecEnv_serive = exports.postNewDecEnv_service = void 0;
const works_querys_1 = require("../utils/queries/works_querys");
const localDB_config_1 = __importDefault(require("../utils/db/localDB_config"));
const postNewDecEnv_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { declaracion_env, id_cam, id_user } = req.body;
        let _id_ = 0;
        // primero creamos la declaracion de envio y guardamos el ID
        const result = yield new Promise((resolve, reject) => {
            localDB_config_1.default.query((0, works_querys_1.generate_dec_env)(), [id_cam, id_user], (err, result) => {
                if (err) {
                    console.log('OCURRIO UN ERROR AL CREAR DECLARACION ENVIO : ', err);
                    reject(err);
                }
                else {
                    console.log('SE CREO LA DECLARACION DE ENVIO');
                    _id_ = result.rows[0].id;
                    resolve(result);
                }
            });
        });
        if (_id_ != 0) {
            let query = 'SELECT * FROM refers_to_dec_envio( $1, $2 );';
            let error = false;
            for (let i = 0; i < declaracion_env.length; i++) {
                // this is to referes to the dec_envio
                const element = declaracion_env[i];
                console.log('REFERENCIAS PARA DEC_ENV: ', element.factura, _id_);
                try {
                    yield new Promise((resolve, reject) => {
                        localDB_config_1.default.query(query, [element.factura, _id_], (err, result) => {
                            if (err) {
                                console.log('ERROR PARA REFERENCIAR LAS FACTURAS : ', err);
                                error = true;
                                reject(err);
                            }
                            else {
                                console.log('SE GENERO REFERENCIAR LAS FACTURAS');
                                resolve(result);
                            }
                        });
                    });
                    // this is to create entregas
                    const create_entreaga_by_factura = 'SELECT * FROM change_state_to_enPreparacion($1);';
                    yield new Promise((resolve, reject) => {
                        localDB_config_1.default.query(create_entreaga_by_factura, [element.factura], (err, result) => {
                            if (err) {
                                console.log('ERROR PARA REFERENCIAR LAS FACTURAS : ', err);
                                error = true;
                                reject(err);
                            }
                            else {
                                console.log('SE GENERO REFERENCIAR LAS FACTURAS');
                                resolve(result);
                            }
                        });
                    });
                }
                catch (err) {
                    // Handle specific error if needed
                }
            }
            if (error === false) {
                res.status(200).json({ message: 'SE CREO LAS REFERENCIAS Y DECLARACION' });
            }
            else {
                res.status(500).json({ message: 'NO CREO LAS REFERENCIAS Y DECLARACION' });
            }
        }
        else {
            console.log('no se genero el id de declaracion de envio : ', _id_);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'NO SE PUDO INGRESAR LA DECLARACION DE ENVIO' });
    }
});
exports.postNewDecEnv_service = postNewDecEnv_service;
// no in use
const getDecEnv_serive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM get_dec_env();';
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                console.log('NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO : ', err);
                res.status(500).json({ message: 'NO SE OBTENER LAS DEC_ENVIOS' });
            }
            else {
                console.log('SE OBTUBIERON LAS DECLARACIONES DE ENVIO');
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('SE OBTUBIERON LAS DECLARACIONES DE ENVIO : ', err);
        res.status(500).json({ message: 'NO SE OBTENER LAS DEC_ENVIOS' });
    }
});
exports.getDecEnv_serive = getDecEnv_serive;
const putDecEnv_serive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
    }
});
exports.putDecEnv_serive = putDecEnv_serive;
// en uso
const getFacts_one_dec = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dec_envio } = req.query;
        if (typeof dec_envio === 'string') {
            let nuew = parseInt(dec_envio);
            //console.log('paso : ', nuew);
            const query = 'select * from getFacts_one_DecEnv($1);';
            localDB_config_1.default.query(query, [nuew], (err, result) => {
                if (err) {
                    console.log('ERROR OBTENIENDO LAS FACTURAS DE LA DECLARACION DE ENVIO : ', err);
                    res.status(500).json({ message: 'ERROR OBTENIENDO LAS FACTURAS DE LA DECLARACION DE ENVIO' });
                }
                else {
                    console.log('SE OBTubieron LAS FACTURAS DE LA DECLARACION DE ENVIO');
                    //console.log(result.rows);
                    res.status(200).json({ data: result.rows });
                }
            });
        }
    }
    catch (err) {
        console.log('ERROR AL OBTENENER RUTA DE FACTURAS : ', err);
        res.status(500).json({ message: 'error para obtener las facturas' });
    }
});
exports.getFacts_one_dec = getFacts_one_dec;
// en uso
const getDecEnvios_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM get_dec_envio_info();';
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                console.log('ERROR PARA OBTENER DECLARACIONES ENVIO : ', err);
                res.status(500).json({ message: 'NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO' });
            }
            else {
                console.log('SE OBTUBO LAS DECLARACIONES DE ENVIO');
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO', err);
        res.status(500).json({ message: 'NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO' });
    }
});
exports.getDecEnvios_service = getDecEnvios_service;
//en uso
const putDecEnv_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        //console.log('=0=>', data);
        const query = 'SELECT * FROM set_change_decenvio($1, $2, $3);';
        localDB_config_1.default.query(query, [data.cam, data.use, data.decenv], (err, result) => {
            if (err) {
                console.log('NO SE PUDO HACER EL CAMBIO', err);
                res.status(500).json({ message: 'NO SE PUDO HACER CAMBIO DE LA DECLARACIONES DE ENVIO' });
            }
            else {
                console.log('SE HIZO CAMBIO DE DECLARACION DE ENVIO');
                res.status(200).json({ message: 'SE HIZO CAMBIO DE DECLARACION DE ENVIO' });
            }
        });
    }
    catch (err) {
        console.log('NO SE PUDO OBTER RUTA LAS DECLARACIONES DE ENVIO', err);
        res.status(500).json({ message: 'NO SE PUDO OBTENER RUTA LAS DECLARACIONES DE ENVIO' });
    }
});
exports.putDecEnv_service = putDecEnv_service;
//# sourceMappingURL=declaracion_env.service.js.map