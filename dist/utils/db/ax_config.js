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
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = exports.pool = void 0;
const mssql_1 = require("mssql");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
if (!process.env.AXUSER || !process.env.AXPASSWORD || !process.env.AXSERVER || !process.env.AXDATABASE) {
    throw new Error('One or more required environment variables are not defined.');
}
const configSQL = {
    user: process.env.AXUSER,
    password: process.env.AXPASSWORD,
    server: process.env.AXSERVER, // Your SQL Server instance
    database: process.env.AXDATABASE,
    options: {
        trustServerCertificate: true, // Set this to true to accept self-signed certificates
    },
};
exports.pool = new mssql_1.ConnectionPool(configSQL);
function executeQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const poolConnect = yield exports.pool.connect();
            const result = yield poolConnect.request().query(query);
            return result.recordset;
        }
        catch (error) {
            throw new Error(`Error executing query =>: ${error}`);
        }
    });
}
exports.executeQuery = executeQuery;
//# sourceMappingURL=ax_config.js.map