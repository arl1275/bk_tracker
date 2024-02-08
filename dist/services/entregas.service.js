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
exports.PicsToSend = exports.toSincronizadoService = exports.toTransitoService = exports.toCargandoService = exports.get_entrega_by_id = exports.generate_void_entrega = exports.get_all_entregas = void 0;
const localDB_config_1 = __importDefault(require("../utils/db/localDB_config"));
const cloudinary_config_1 = require("../utils/db/cloudinary_config");
//--------------------------------------------------//
//                  GENERAL FUNCTIONS               //
//--------------------------------------------------//
const get_all_entregas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //this has to be changed
        const query = 'SELECT * FROM entregas';
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'error al obtener datos' });
            }
            else {
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'error al enviar peticion' });
    }
});
exports.get_all_entregas = get_all_entregas;
const generate_void_entrega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [ref_entrega, id_estado] = req.body;
    const query = 'INSERT INTO consolidados (ref_entrega, id_estado) values ($1, $2)';
    try {
        localDB_config_1.default.query(query, ["TEST", 1]);
    }
    catch (err) {
        console.log('ERROR AL GENERAR ENTREGA: ', err);
    }
});
exports.generate_void_entrega = generate_void_entrega;
const get_entrega_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM entregas WHERE id = ($1)';
        const [id] = req.body;
        localDB_config_1.default.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'valor no existe' });
            }
            else {
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'error' });
    }
});
exports.get_entrega_by_id = get_entrega_by_id;
//--------------------------------------------------//
//             CHANGE OF STATE FUNCTIONS            //
//--------------------------------------------------//
const toCargandoService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const query = "SELECT * FROM tocargando($1);";
        let num = parseInt(id);
        localDB_config_1.default.query(query, [num], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A CARGAR' });
            }
            else {
                console.log('FACTURA ENVIADA A CARGAR : ', num);
                res.status(200).json({ message: 'SE ENVIO A CARGAR' });
            }
        });
    }
    catch (err) {
        console.log("error :", err);
        res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A LA RUTA PARA CARGAR : ', err });
    }
});
exports.toCargandoService = toCargandoService;
const toTransitoService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('entro a service para enviar a transito');
        const values = req.body;
        console.log(values);
        if (!Array.isArray(values)) {
            throw new Error("IS NOT A ARRAY");
        }
        const query = "SELECT * FROM toTransito($1);";
        let errorOccurred = false;
        for (let i = 0; i < values.length; i++) {
            console.log('entro al for del ingreso para cambio de estado');
            yield new Promise((resolve, reject) => {
                localDB_config_1.default.query(query, [values[i]], (err, result) => {
                    if (err) {
                        console.error('Error al ejecutar la consulta:', err);
                        errorOccurred = true;
                    }
                    resolve();
                });
            });
        }
        if (errorOccurred) {
            res.status(500).json({ message: 'NO SE ENVIARON LAS FACTURAS A TRANSITO' });
            console.log('SE GENERO UN ERROR AL OBTENER LA RUTA');
        }
        else {
            console.log('SE ENVIO LA FACTURA A TRANSITO');
            res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A TRANSITO' });
        }
    }
    catch (err) {
        console.log("error :", err);
        res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A LA RUTA PARA TRANSITO : ', err });
    }
});
exports.toTransitoService = toTransitoService;
const toSincronizadoService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let valores = [];
        valores = yield req.body;
        const query = "SELECT * FROM tosincronizado ($1, $2, $3, $4, $5);";
        let errorOccurred = false;
        console.log('upload data : ', valores);
        if (valores) {
            for (let i = 0; i < valores.length; i++) {
                // data to insert into DB
                let picName = 'N/A';
                let SingName = '';
                // data to insert into Cloudinary
                const { nameSing, namePic, fech_hora_entrega, id, ref_factura } = valores[i];
                if (typeof nameSing === 'string') {
                    SingName = yield (0, cloudinary_config_1.uploadFileToCloudinary)(nameSing, 'despacho_bodega', ref_factura);
                    if (valores[0].namePic) {
                        if (typeof namePic === 'string' && namePic != 'N/A') {
                            let headPic = ref_factura + 'PICNAME';
                            picName = yield (0, cloudinary_config_1.uploadFileToCloudinary)(namePic, 'despacho_bodega', headPic);
                        }
                    }
                }
                else {
                    console.log('VALOR NO ES STRING', valores[0].nameSing);
                }
                console.log('fotos sing : ', SingName, ' fotos pic : ', picName);
                localDB_config_1.default.query(query, [id, fech_hora_entrega, picName, SingName, ref_factura], (err, result) => {
                    if (err) {
                        console.log('ERROR AL SINCRONIZAR : ', err);
                    }
                    else {
                        console.log('fotos sing : ', SingName.length, ' fotos pic : ', picName.length);
                        console.log('FACTURA SE HA SINCRONIZADO');
                    }
                });
            }
        }
        if (errorOccurred) {
            res.status(500).json({ message: 'NO SE ENVIARON LAS FACTURAS A TRANSITO' });
            console.log('SE GENERO UN ERROR AL OBTENER LA RUTA');
        }
        else {
            console.log('SE SINCRONIZO LA FACTURA');
            res.status(200).json({ message: 'SE SINCRONIZO LA FACTURA' });
        }
    }
    catch (err) {
        console.log("error :", err);
        res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A LA RUTA PARA SINCRONIZAR: ', err });
    }
});
exports.toSincronizadoService = toSincronizadoService;
//--------------------------------------------------//
//                IMAGE FUNCTIONS                   //
//--------------------------------------------------//
const PicsToSend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const query = 'SELECT * FROM getpicsofonefact($1)';
        if (id != undefined) {
            localDB_config_1.default.query(query, [id], (err, result) => {
                if (err) {
                    console.log('ERROR AL ENVIAR FOTOS : ', err);
                    res.status(500).json({ message: 'valor no existe', err });
                }
                else {
                    console.log('SE ENVIARON FOTOS DE FACTURA : ', id);
                    res.status(200).json({ data: result.rows });
                }
            });
        }
        else {
            console.log('not a number');
        }
    }
    catch (err) {
        console.log('ERROR AL ACCEDER A RUTA : ', err);
        res.status(500).json({ message: 'NO SE PUDO ACCEDER A LA RUTA' });
    }
});
exports.PicsToSend = PicsToSend;
