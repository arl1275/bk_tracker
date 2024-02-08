"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPicsOneFactController = exports.entregatoSincronizarController = exports.entregatoTransitoController = exports.entregatoCargandoController = exports.gen_void_entrega_con = exports.get_entrega_by_id_controller = exports.get_all_entregas_controller = void 0;
const entregas_service_1 = require("../services/entregas.service");
//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------
let get_all_entregas_controller = (req, res) => { (0, entregas_service_1.get_all_entregas)(req, res); };
exports.get_all_entregas_controller = get_all_entregas_controller;
let get_entrega_by_id_controller = (req, res) => { (0, entregas_service_1.get_entrega_by_id)(req, res); };
exports.get_entrega_by_id_controller = get_entrega_by_id_controller;
let gen_void_entrega_con = (req, res) => { (0, entregas_service_1.generate_void_entrega)(req, res); };
exports.gen_void_entrega_con = gen_void_entrega_con;
//----------------------------------------------------
//          STATE FUNCTIONS
//----------------------------------------------------
let entregatoCargandoController = (req, res) => { (0, entregas_service_1.toCargandoService)(req, res); };
exports.entregatoCargandoController = entregatoCargandoController;
let entregatoTransitoController = (req, res) => { (0, entregas_service_1.toTransitoService)(req, res); };
exports.entregatoTransitoController = entregatoTransitoController;
let entregatoSincronizarController = (req, res) => { (0, entregas_service_1.toSincronizadoService)(req, res); };
exports.entregatoSincronizarController = entregatoSincronizarController;
//----------------------------------------------------
//          PICS FUNCTIONS
//----------------------------------------------------
let getPicsOneFactController = (req, res) => { (0, entregas_service_1.PicsToSend)(req, res); };
exports.getPicsOneFactController = getPicsOneFactController;
