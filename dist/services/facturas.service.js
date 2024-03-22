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
exports.forceFactura_service = exports.change_state_to_null = exports.getAdminFacts_service = exports.getCajasOneFact_service = exports.getHistoFact_service = exports.subir_fotos = exports.get_facturas_en_transito = exports.get_cajas_one_fact = exports.change_sincronizado_service = exports.change_transito_service = exports.change_preparacion_service = exports.get_facturas_all = exports.get_facturas_actives = exports.get_all_facturas_service = void 0;
const localDB_config_1 = __importDefault(require("../utils/db/localDB_config"));
const pg_format_1 = __importDefault(require("pg-format"));
const cloudinary_config_1 = require("../utils/db/cloudinary_config");
const force_syncro_1 = require("../utils/syncro_functions/force_synchro/force_syncro");
//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------
// EN USO
let get_all_facturas_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM resumen_facturas_para_despacho()';
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
            }
            else {
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log("NO SE PUDO REALIZAR LA PETICION DE LAS FACTURAS");
    }
});
exports.get_all_facturas_service = get_all_facturas_service;
let get_facturas_actives = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, pg_format_1.default)('SELECT * FROM get_facts_active();');
    try {
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'IMPOSIBLE OBTENER TODAS LAS FACTURAS ACTIVAS: ', err });
            }
            else {
                console.log("SE OBTUBIERON TODAS LAS FACTURAS ACTIVAS");
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('NO SE PUDO INGRESAR A LA RUTA');
        res.status(500).json({ mesage: 'ERROR AL OBTENER RUTA' });
    }
});
exports.get_facturas_actives = get_facturas_actives;
let get_facturas_all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, pg_format_1.default)('SELECT * FROM resumen_all_facturas();');
    try {
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'IMPOSIBLE OBTENER TODAS LAS FACTURAS: ', err });
            }
            else {
                console.log("SE OBTUBIERON TODAS LAS FACTURAS DESDE LA VISTA ADMIN");
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('NO SE PUDO INGRESAR A LA RUTA');
        res.status(500).json({ mesage: 'ERROR AL OBTENER RUTA' });
    }
});
exports.get_facturas_all = get_facturas_all;
let change_preparacion_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { factura } = req.body;
        const lista_facturas = factura;
        const query = 'SELECT * FROM change_state_to_enpreparacion($1);';
        let is_err;
        for (let i = 0; i < lista_facturas.length; i++) {
            const factura_ = lista_facturas[i].Factura;
            localDB_config_1.default.query(query, [factura_], (err, result) => {
                if (err) {
                    console.log('NO SE PUDO ENVIAR A PREPARACION : ', err);
                    is_err = true;
                }
                else {
                    console.log('SE ENVIO A PREPARACION : ', factura_);
                    is_err = false;
                }
            });
        }
        if (is_err === true) {
            res.status(500).json({ message: 'ERROR AL ENVIAR A PREPARACION' });
        }
        else {
            res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A PREPARACION' });
        }
    }
    catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE A PREPARACION : ', err);
        res.status(500).json({ message: 'ERROR AL ALCANZAR RUTA DE A PREPARACION' });
    }
});
exports.change_preparacion_service = change_preparacion_service;
//EN USO
// export let change_transito_service = async ( req: Request, res: Response ) => {
//     try {
//         let data_to_mail : string[] = [];                                   // this is to save the facturas references, to generate an Email.
//         const data = req.body;
//         console.log('DATA DESDE LA APP :::' , data);
//         const query = 'SELECT * FROM change_state_to_entransito($1);'; // the $1, is the referencence of the factura
//         let is_err;
//          for (let i = 0; i < data.length; i++) {
//              const factura_ = data[i];
//             let result = await connDB.query(query, [factura_], (err, result)=>{
//                   if(err){
//                       console.log('NO SE PUDO ENVIAR A TRANSITO : ', err);
//                       is_err = true;
//                   }else{
//                       console.log('SE ENVIO A TRANSITO : ', factura_);
//                       data_to_mail.push(factura_);
//                       is_err = false
//                   }
//               })
//          }
//         if(is_err === true){
//             res.status(500).json({ message : 'ERROR AL ENVIAR A TRANSITO'});
//         }else{
//             console.log('DESDE LA RUTA :::', data_to_mail);
//             await sendEmail_transito(data_to_mail);
//             res.status(200).json({ message : 'SE ENVIARON LAS FACTURAS A TRANSITO'});
//         }
//     } catch (err) {
//         console.log('ERROR AL ALCANZAR RUTA DE TRANSITO : ', err);
//         res.status(500).json({ message : 'ERROR AL ALCANZAR RUTA DE TRANSITO'});
//     }
// }
let change_transito_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data_to_mail = []; // Array para guardar las referencias de las facturas
        const data = req.body;
        console.log('DATA DESDE LA APP:', data);
        const query = 'SELECT * FROM change_state_to_entransito($1);'; // La variable $1 es la referencia de la factura
        for (let i = 0; i < data.length; i++) {
            const factura_ = data[i];
            try {
                const result = yield localDB_config_1.default.query(query, [factura_]);
                console.log('SE ENVIO A TRANSITO:', factura_);
                data_to_mail.push(factura_);
            }
            catch (err) {
                console.log('NO SE PUDO ENVIAR A TRANSITO:', err);
                res.status(500).json({ message: 'ERROR AL ENVIAR A TRANSITO' });
                return; // Termina la ejecución de la función si hay un error
            }
        }
        console.log('DESDE LA RUTA:', data_to_mail);
        //await sendEmail_transito(data_to_mail);
        res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A TRANSITO' });
    }
    catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE TRANSITO:', err);
        res.status(500).json({ message: 'ERROR AL ALCANZAR RUTA DE TRANSITO' });
    }
});
exports.change_transito_service = change_transito_service;
let change_sincronizado_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { factura } = req.body;
        const lista_facturas = factura;
        const query = 'SELECT * FROM  change_state_to_sincronizado($1, $2);';
        let is_err;
        for (let i = 0; i < lista_facturas.length; i++) {
            const factura_ = lista_facturas[i].Factura;
            localDB_config_1.default.query(query, [factura_,], (err, result) => {
                if (err) {
                    console.log('NO SE PUDO ENVIAR A TRANSITO : ', err);
                    is_err = true;
                }
                else {
                    console.log('SE ENVIO A TRANSITO : ', factura_);
                    is_err = false;
                }
            });
        }
        if (is_err === true) {
            res.status(500).json({ message: 'ERROR AL ENVIAR A TRANSITO' });
        }
        else {
            res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A TRANSITO' });
        }
    }
    catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE TRANSITO : ', err);
        res.status(500).json({ message: 'ERROR AL ALCANZAR RUTA DE TRANSITO' });
    }
});
exports.change_sincronizado_service = change_sincronizado_service;
// EN USO
let get_cajas_one_fact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { factura } = req.query;
        const query = 'SELECT * FROM get_boxes_oneFact($1);';
        localDB_config_1.default.query(query, [factura], (err, result) => {
            if (err) {
                console.log('NO SE PUEDIERON OBTENER LAS CAJAS : ', err);
                res.status(500).json({ message: ' NO SE PUDO OBTENER LAs CAJAS' });
            }
            else {
                console.log('SE PUEDIERON OBTENER LAS CAJAS');
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('NO SE PUDO OBTENER LA RUTA DE CAJAS');
        res.status(500).json({ message: ' NO SE PUDO OBTENER LA RUTA DE CAJAS' });
    }
});
exports.get_cajas_one_fact = get_cajas_one_fact;
// en uso
let get_facturas_en_transito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        console.log('data de get facturas : ', req.query);
        const query = 'SELECT * FROM get_transito_facturas($1);';
        localDB_config_1.default.query(query, [id], (err, result) => {
            if (err) {
                console.log('ERROR AL OBTENER FACTURAS EN TRANSITO : ', err);
                res.status(500).json({ message: 'no se pudo obtener las facturas en transito' });
            }
            else {
                console.log('SE OBTUBIERON LAS FACTURAS EN TRANSITO DE : ', id);
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('NO SE PUDO ALCANZAR LA RUTA DE OBTENER FACTURAS EN TRANSITO');
        res.status(500).json({ message: 'no se pudo obtener las facturas en transito' });
    }
});
exports.get_facturas_en_transito = get_facturas_en_transito;
// en uso
// export let subir_fotos = async ( req: Request, res: Response ) => {
//     try {
//         const data = req.body;
//         const query = 'SELECT * FROM sincro_fact( $1, $2, $3, $4, $5);'; 
//         let fact_list_to_mail : string[] = [];                                                                  // this save the facturas to send an email.
//         let error;
//         //console.log('data from APK :: ', data)
//         for (let i = 0; i < data.length; i++) {
//             const element = data[i];
//             const firma_ = await uploadFileToCloudinary(element.nameSing, 'bodega_despacho', element.factura);
//             const foto_ = await uploadFileToCloudinary(element.namePic, 'bodega_despacho', element.factura + '_foto');
//             if(firma_ != null && foto_ != null){
//                 connDB.query(query, [element.factura, foto_, firma_, 'N/A', element.fech_hora_entrega], (err, result) => {
//                     if(err){
//                         error = false;
//                         console.log('ERROR AL CREAR FOTOS : ', err);
//                     }else{
//                         fact_list_to_mail.push(element.factura);
//                         error = true;
//                     }
//                 });
//             }else{
//                 console.log('NO SE GENERARON LAS FOTOS');
//                 res.status(500).json({ message : 'NO SE PUDO GENERAR LAS FOTOS'});
//             }
//         }
//         if(error == false){
//             console.log('NO SE PUDO GENERAR LA SINCRONIZACION');
//             res.status(500).json({ message : 'NO SE PUDO GENERAR LAS FOTOS'});
//         }else{
//             console.log('data to send file ::: ', fact_list_to_mail)
//             console.log('SE GENERARON LAS FOTOS Y SE SINCRONIZO');
//             sendEmail_Entregados(fact_list_to_mail);
//             res.status(200).json({ message : 'SE GENERO LA SINCRONIZACION'});
//         }
//     } catch (err) {
//         console.log('ERROR AL OBTENER RUTA DE SYNCRONIZACION : ', err);
//         res.status(500).json({ message : 'NO SE PUEDE OBTENER RUTA DE SYNCRONIZACION DE FACTURAS' });
//     }
// }
let subir_fotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const query = 'SELECT * FROM sincro_fact($1, $2, $3, $4, $5);';
        let fact_list_to_mail = []; // Array para guardar las facturas para enviar un correo electrónico
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const firma_ = yield (0, cloudinary_config_1.uploadFileToCloudinary)(element.nameSing, 'bodega_despacho', element.factura);
            const foto_ = yield (0, cloudinary_config_1.uploadFileToCloudinary)(element.namePic, 'bodega_despacho', element.factura + '_foto');
            if (firma_ != null && foto_ != null) {
                try {
                    yield new Promise((resolve, reject) => {
                        localDB_config_1.default.query(query, [element.factura_id, foto_, firma_, 'N/A', element.fech_hora_entrega], (err, result) => {
                            if (err) {
                                console.log('ERROR AL CREAR FOTOS:', err);
                                reject(err);
                            }
                            else {
                                fact_list_to_mail.push(element.factura);
                                resolve();
                            }
                        });
                    });
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                console.log('NO SE GENERARON LAS FOTOS');
                res.status(500).json({ message: 'NO SE PUDO GENERAR LAS FOTOS' });
                return;
            }
        }
        console.log('data to send file:', fact_list_to_mail);
        console.log('SE GENERARON LAS FOTOS Y SE SINCRONIZARON');
        //await sendEmail_Entregados(fact_list_to_mail);
        res.status(200).json({ message: 'SE GENERO LA SINCRONIZACION' });
    }
    catch (err) {
        console.log('ERROR AL OBTENER RUTA DE SYNCRONIZACION:', err);
        res.status(500).json({ message: 'NO SE PUEDE OBTENER RUTA DE SYNCRONIZACION DE FACTURAS' });
    }
});
exports.subir_fotos = subir_fotos;
// en uso
let getHistoFact_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM get_summary_data();';
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                console.log('ERROR AL OBTENER DATA : ', err);
                res.status(500).json({ message: 'NO SE PUDO OBTENER RUTA' });
            }
            else {
                console.log('SE OBTUBIERON LOS HISTORICOS');
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('ERROR AL OBTENER RUTA: ', err);
        res.status(500).json({ message: 'NO SE PUDO OBTENER RUTA' });
    }
});
exports.getHistoFact_service = getHistoFact_service;
// en uso
let getCajasOneFact_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.query;
        let error = false;
        let cajas_arr = [];
        const query = 'SELECT * FROM get_cajas_of_fact($1, $2);';
        if (Array.isArray(data)) {
            yield Promise.all(data.map((element) => __awaiter(void 0, void 0, void 0, function* () {
                let id_ = parseInt(element.id_fact);
                let factura = '';
                if (typeof element.fact === 'string')
                    factura = element.fact;
                try {
                    const result = yield new Promise((resolve, reject) => {
                        localDB_config_1.default.query(query, [id_, factura], (err, result) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(result);
                            }
                        });
                    });
                    cajas_arr.push(...result.rows);
                }
                catch (err) {
                    error = true;
                }
            })));
        }
        if (error === false && cajas_arr.length > 0) {
            //console.log('data a mandar : ', cajas_arr);
            console.log('SE OBTUVIERON LAS CAJAS');
            res.status(200).json({ data: cajas_arr });
        }
        else {
            res.status(500).json({ message: 'Error obtaining cajas' });
            console.log('Failed to obtain cajas');
        }
    }
    catch (err) {
        console.error('Error in getCajasOneFact_service:', err);
        res.status(500).json({ message: 'Failed to obtain cajas' });
    }
});
exports.getCajasOneFact_service = getCajasOneFact_service;
// en uso
let getAdminFacts_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM get_invoice_info();';
        localDB_config_1.default.query(query, (err, result) => {
            if (err) {
                console.log('ERROR AL OBTENER DATA :', err);
                res.status(500).json({ message: 'ERROR AL OBTENER DATA' });
            }
            else {
                console.log('SE OBTUBIERON LAS FACTURAS ADMIN');
                res.status(200).json({ data: result.rows });
            }
        });
    }
    catch (err) {
        console.log('ERRO AL OBTENER LA RUTA :', err);
        res.status(500).json({ message: 'ERROR AL OBTENER RUTA' });
    }
});
exports.getAdminFacts_service = getAdminFacts_service;
// en uso
let change_state_to_null = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { factura } = req.query;
        let val = '';
        if (typeof factura === 'string')
            val = factura;
        const query = 'SELECT * FROM change_state_to_null_state($1);';
        localDB_config_1.default.query(query, [val], (err, result) => {
            if (err) {
                console.log('ERROR NO SE PUDO HACER CAMBIO DE FACTURA', err);
                res.status(500).json({ message: 'NO SE PUDO HACER EL CAMBIO DE LA FACTURA' });
            }
            else {
                console.log('SE REALIZO EL CAMBIO DE FACTURA');
                res.status(200).json({ message: 'SE REALIZO EL CAMBIO DE LA FACTURA A NULL' });
            }
        });
    }
    catch (err) {
        console.log('ERROR NO SE PUDO HACER CAMBIO DE FACTURA', err);
        res.status(500).json({ message: 'NO SE PUDO HACER EL CAMBIO DE LA FACTURA' });
    }
});
exports.change_state_to_null = change_state_to_null;
//---------------------------- THIS IS AN ADMIN FUNCTION SERVICE ------------------------------------//
let forceFactura_service = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pedidoventa, factura, albaran } = req.body;
        if (typeof pedidoventa === 'string' && typeof factura === 'string' && typeof albaran === 'string') {
            yield (0, force_syncro_1.ForceSynchro)(pedidoventa, factura, albaran);
            res.status(200).json({ message: 'data sin saver si se ingreso' });
        }
        else {
            res.status(500).json({ message: '|| NO SE EJECUTO LAS FUNCIONES' });
        }
    }
    catch (err) {
        console.log(' ERROR AL FORZAR SINCRONIZACION :', err);
        res.status(500).json({ message: ' NO SE PUDO SINCRONIZAR LA FACTURA MANUALMENTE' });
    }
});
exports.forceFactura_service = forceFactura_service;
