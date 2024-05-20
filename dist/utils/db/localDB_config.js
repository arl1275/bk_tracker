"use strict";
//-----------------------------------------------//
//  THIS REFERS TO OUR POSTGRES DB
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
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const connDB = new pg_1.Pool({
    user: process.env.DBuser,
    host: process.env.DBhost,
    database: process.env.DBdatabase,
    password: process.env.DBpassword,
    port: 8080, // Default PostgreSQL port
});
connDB.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    }
    else {
        console.log('Connected to PostgreSQL:', res.rows[0]);
    }
});
exports.default = connDB;
