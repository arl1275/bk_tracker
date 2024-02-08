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
exports.delete_one_camion_service = exports.update_QR_camion_service = exports.update_placa_camion_service = exports.post_new_camion_service = exports.get_camion_by_id_service = exports.get_all_camiones_service = void 0;
const localDB_config_1 = __importDefault(require("../utils/db/localDB_config"));
//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------
let get_all_camiones_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        localDB_config_1.default.query('SELECT * FROM camiones', (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
            }
            else {
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'err al enviar solucitud' });
    }
});
exports.get_all_camiones_service = get_all_camiones_service;
//----------------------------------------------------
//          CRUD FUNCTIONS
//----------------------------------------------------
let get_camion_by_id_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [id] = req.body;
        const query = 'SELECT * FROM camiones WHERE id = ($1)';
        localDB_config_1.default.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'erro al obtner camion' });
            }
            else {
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'err al enviar solucitud' });
    }
});
exports.get_camion_by_id_service = get_camion_by_id_service;
let post_new_camion_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { placa, QR, modelo } = req.body;
        const query = 'INSERT INTO camiones (placa, modelo, qr) values ($1, $2, $3)';
        localDB_config_1.default.query(query, [placa, QR, modelo], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'error al crear camion' });
                console.log('ERROR : crear camion => ', err);
            }
            else {
                res.status(200).json({ message: 'se creo camion' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'err al enviar solucitud' });
    }
});
exports.post_new_camion_service = post_new_camion_service;
let update_placa_camion_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [id, placa] = req.body;
        const query = 'UPDATE camiones SET placa = ($1) WHERE id = ($2)';
        localDB_config_1.default.query(query, [placa, id], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'ERROR al modificar placa' });
            }
            else {
                res.status(200).json({ message: 'Se actualizo camion' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'err al enviar solucitud' });
    }
});
exports.update_placa_camion_service = update_placa_camion_service;
let update_QR_camion_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [id, QR] = req.body;
        const query = 'UPDATE camiones SET qr = ($1) WHERE id = ($2)';
        localDB_config_1.default.query(query, [QR, id], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'ERROR al modificar QR' });
            }
            else {
                res.status(200).json({ message: 'Se actualizo QR' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'err al enviar solucitud' });
    }
});
exports.update_QR_camion_service = update_QR_camion_service;
let delete_one_camion_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [id] = req.body;
        const query = 'DELETE FROM camiones WHERE id = ($1)';
        localDB_config_1.default.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'ERROR al eliminar camion' });
            }
            else {
                res.status(200).json({ message: 'Se elimino camion' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'err al enviar solucitud' });
    }
});
exports.delete_one_camion_service = delete_one_camion_service;
//# sourceMappingURL=camion.service.js.map