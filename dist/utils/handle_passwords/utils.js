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
exports.ComparedPassWord = exports.EncryptPassword_ = void 0;
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
//                               PIC HANDLERS                         //                
//--------------------------------------------------------------------//
//# sourceMappingURL=utils.js.map