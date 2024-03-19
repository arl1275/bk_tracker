"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.passUser_appService = exports.passUser_service = exports.authCheck_service = exports.UpdateUserService = exports.DelUser = exports.CreateUserService = exports.getAllUsuarios = exports.get_all_entregadores_service = void 0;
const localDB_config_1 = __importDefault(require("../utils/db/localDB_config"));
const pg_format_1 = __importDefault(require("pg-format"));
const utils_1 = require("../utils/handle_passwords/utils");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let get_all_entregadores_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        localDB_config_1.default.query('SELECT id, nombre FROM users WHERE id_role = 3;', (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ message: 'error al obtener entregadores' });
            }
            else {
                //console.log('Query result:', result.rows);
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.error(`Ha ocurrido un error: ${err}`);
        res.status(500).json({ message: 'error al obtener entregadores' });
    }
});
exports.get_all_entregadores_service = get_all_entregadores_service;
//-----------------------------------------------------------------//
//                      CRUD OF USERS                              //
//-----------------------------------------------------------------//
let getAllUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM users;';
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'ERR AL OBTENER TODOS LOS USUARIOS' });
                console.log('el error es: ', err);
            }
            else {
                res.status(200).json({ data: result.rows });
                console.log('SE ENVIO TODOS LOS USUARIOS');
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'ERR AL OBTENER TODOS LOS USUARIOS' });
    }
});
exports.getAllUsuarios = getAllUsuarios;
// this is to create users
let CreateUserService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, codEmpleado, rol, _Password, _QR } = req.body;
        let hassPas = yield (0, utils_1.EncryptPassword_)(_Password);
        let val = 0;
        // THIS IS TO SELECT THE ROLE OF THE NEW USER
        if (rol === '1') {
            val = 1;
        }
        else if (rol === '2') {
            val = 2;
        }
        else if (rol === '3') {
            val = 3;
        }
        else if (rol === '4') {
            val = 4;
        }
        const query = "INSERT INTO users (nombre, cod_empleado, id_role, hashed_password, qr) VALUES ($1, $2, $3, $4, $5);";
        let values = [nombre, codEmpleado, val, hassPas, _QR];
        localDB_config_1.default.query(query, values, (err, result) => {
            if (err) {
                console.log('EROR AL CREAR :', err);
                res.status(500).json({ message: 'NO SE CREO USUARIO EN DB' });
            }
            else {
                res.status(200).json({ message: 'SE CREO EL USUARIO' });
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'NO SE LLEGO A LA RUTA', err });
    }
});
exports.CreateUserService = CreateUserService;
let DelUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const query = (0, pg_format_1.default)('DELETE FROM usuarios WHERE id = %L', id);
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'ERR PARA ELIMINAR EL USUARIO', err });
            }
            else {
                res.status(200).json({ message: 'SE ELIMINO EL USUARIO' });
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'ERR PARA ELIMINAR EL USUARIO', err });
    }
});
exports.DelUser = DelUser;
let UpdateUserService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, nombre, cod_empleado, id_rol, _password, _qr } = req.body;
        //console.log('nueva contraseña : ', _password, ' tipo : ', typeof _password);
        const _hassPas = yield (0, utils_1.EncryptPassword_)(`${_password}`);
        const query = "UPDATE users SET nombre = $1, cod_empleado = $2, hashed_password = $3, qr = $4 WHERE id = $5";
        let values = [nombre, cod_empleado, _hassPas, _qr, id];
        localDB_config_1.default.query(query, values, (err) => {
            if (err) {
                console.log('EROR AL MODIFICAR :', err);
                res.status(500).json({ message: 'NO SE CREO USUARIO EN DB' });
            }
            else {
                res.status(200).json({ message: 'SE CREO EL USUARIO' });
            }
        });
    }
    catch (err) {
        console.log('ERROR TO UPDATE USER', err);
        res.status(500).json({ message: 'NO SE PUDO OBTENER RUTA PARA ACTUALIZAR USUARIO' });
    }
});
exports.UpdateUserService = UpdateUserService;
//-----------------------------------------------------------------//
//                      Check user sing                            //
//-----------------------------------------------------------------//
let authCheck_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, cod_empleado } = req.query;
        res.status(200);
    }
    catch (err) {
        console.log(' USUARIO SIN TOCKEN ');
        res.status(401);
    }
});
exports.authCheck_service = authCheck_service;
let passUser_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, _password } = req.query;
        const query = 'SELECT nombre, hashed_password, id_role, cod_empleado FROM users WHERE nombre = $1';
        localDB_config_1.default.query(query, [user], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log('ERROR AL ENVIAR A VALIDAR USUARIO : ', err);
                res.status(500).json({ message: 'ERROR AL REALIZAR LA CONSULTA' });
            }
            else {
                if (result.rows.length > 0) {
                    if (result.rows[0].id_role === 1 || result.rows[0].id_role === 4) {
                        if (typeof _password === 'string') {
                            const valid = yield (0, utils_1.ComparedPassWord)(_password, result.rows[0].hashed_password);
                            if (valid) {
                                const usurario = {
                                    nombre: result.rows[0].nombre,
                                    cod_empleado: result.rows[0].cod_empleado,
                                    type_: result.rows[0].id_role
                                };
                                const token = yield (0, utils_1.generate_token)(usurario.nombre);
                                console.log('SE INGRESO VIA FRONT-END KELLER-CHECK');
                                res.status(200).json({ token, usurario });
                            }
                            else {
                                console.log('SE INTENGO INGRESAR AL KELLER');
                                res.status(500);
                            }
                        }
                        else {
                            console.log('LA CONTRASEÑA NO ES UN STRING');
                            res.status(500).json({ message: 'la contraseña no es un string' });
                        }
                    }
                    else {
                        res.status(500).json({ message: 'NO ES UN ADMINISTRADOR' });
                    }
                }
                else {
                    res.status(500).json({ message: 'USUARIO INVALIDO' });
                }
            }
        }));
    }
    catch (err) {
        res.status(500).json({ message: 'NO SE PUDO OBTENER LA RUTA DE ACCESO' });
    }
});
exports.passUser_service = passUser_service;
let passUser_appService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, _password } = req.query;
        const query = 'SELECT id, qr, nombre, hashed_password, id_role, cod_empleado FROM users WHERE nombre = $1';
        localDB_config_1.default.query(query, [user], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log('ERROR AL ENVIAR A VALIDAR USUARIO : ', err);
                res.status(500).json({ message: 'ERROR AL REALIZAR LA CONSULTA' });
            }
            else {
                if (result.rows.length > 0) {
                    if (result.rows[0].id_role === 2 || result.rows[0].id_role === 3) {
                        if (typeof _password === 'string') {
                            const valid = yield (0, utils_1.ComparedPassWord)(_password, result.rows[0].hashed_password);
                            if (valid) {
                                const usurario = {
                                    id_user: result.rows[0].id,
                                    nombre: result.rows[0].nombre,
                                    cod_empleado: result.rows[0].cod_empleado,
                                    qr: result.rows[0].qr,
                                    type_: result.rows[0].id_role
                                };
                                console.log('SE INGRESO VIA APP-END KELLER-CHECK');
                                res.status(200).json({ data: usurario });
                            }
                            else {
                                res.status(500).json({ message: 'usuario invalido' });
                            }
                        }
                        else {
                            console.log('LA CONTRASEÑA NO ES UN STRING');
                            res.status(500).json({ message: 'la contraseña no es un string' });
                        }
                    }
                    else {
                        res.status(500).json({ message: 'NO ES UN GUARDIA O ENTREGADOR' });
                    }
                }
                else {
                    res.status(401).json({ message: 'USUARIO INVALIDO' });
                }
            }
        }));
    }
    catch (err) {
        console.log('ERROR : ', err);
        res.status(500).json({ message: 'no se pudo ingresar a la ruta' });
    }
});
exports.passUser_appService = passUser_appService;
