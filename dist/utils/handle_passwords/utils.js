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
exports.Force_Sincro = exports.obtenerFechaConAtraso = exports.obtenerFechaActual = exports.ComparedPassWord = exports.EncryptPassword_ = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
//--------------------------------------------------------------------//
//                    ENCRIPTACION DE CONTRASEÑAS                     //                
//--------------------------------------------------------------------//
const EncryptPassword_ = (_password) => {
    //console.log('constraseña : ', _password, ' tipo :', typeof _password);
    const hasshedPAs = bcrypt_1.default.hash(_password, 10);
    console.log('SE MODIFICO CONTRASEÑA DE USUARIO');
    return hasshedPAs;
};
exports.EncryptPassword_ = EncryptPassword_;
const ComparedPassWord = (LogPassword, DBPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = yield bcrypt_1.default.compare(LogPassword, DBPassword);
        return match;
    }
    catch (err) {
        return false;
    }
});
exports.ComparedPassWord = ComparedPassWord;
//--------------------------------------------------------------------//
//                            DATE GENERATORS                         //                
//--------------------------------------------------------------------//
function agregarCeroALaIzquierda(numero) {
    return numero < 10 ? `0${numero}` : `${numero}`;
}
function obtenerFechaActual() {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = agregarCeroALaIzquierda(fechaActual.getMonth() + 1);
    const dia = agregarCeroALaIzquierda(fechaActual.getDate());
    console.log(`data actualizada en : ${año}-${mes}-${dia}`);
    return `${año}-${mes}-${dia}`;
}
exports.obtenerFechaActual = obtenerFechaActual;
function obtenerFechaConAtraso(props) {
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() - props); // Restar 3 días
    const año = fechaActual.getFullYear();
    const mes = agregarCeroALaIzquierda(fechaActual.getMonth() + 1);
    const dia = agregarCeroALaIzquierda(fechaActual.getDate());
    return `${año}-${mes}-${dia}`;
}
exports.obtenerFechaConAtraso = obtenerFechaConAtraso;
function Force_Sincro(Encabezado, cajas) {
}
exports.Force_Sincro = Force_Sincro;
