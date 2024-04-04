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
exports.obtenerFechaConAtraso = exports.obtenerFechaActual = exports.generate_token = exports.ComparedPassWord = exports.EncryptPassword_ = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
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
//                            JWT HANDLERS                            //                
//--------------------------------------------------------------------//
const generate_token = (pass_) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_SECRET) {
        return null;
    }
    const tocken = jsonwebtoken_1.default.sign({ id: pass_ }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return tocken;
});
exports.generate_token = generate_token;
//--------------------------------------------------------------------//
//                            DATE GENERATORS                         //                
//--------------------------------------------------------------------//
function agregarCeroALaIzquierda(numero) {
    return numero < 10 ? `0${numero}` : `${numero}`;
}
function obtenerFechaActual(MenosDias) {
    const fechaActual = new Date();
    const fechaRestada = new Date(fechaActual.getTime() - MenosDias * 24 * 60 * 60 * 1000); // Resta días en milisegundos
    const año = fechaRestada.getFullYear();
    const mes = agregarCeroALaIzquierda(fechaRestada.getMonth() + 1);
    const dia = agregarCeroALaIzquierda(fechaRestada.getDate());
    console.log(`Fecha restada ${MenosDias} días: ${año}-${mes}-${dia}`);
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
