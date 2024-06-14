"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockFacturas_controller = exports.blockFacturas_controller = exports.forceFactura_controller = exports.toNullState_controller = exports.getAdminFacts_controller = exports.getCajasFAct_controller_Entregador = exports.getHistoFact_controller = exports.postFotos_controller = exports.getTransFact_controller = exports.toTransito_controller = exports.get_cajas_controller_Guardia = exports.get_all_facturas_ = exports.get_all_facturas_actives = exports.get_all_facturas_controller = void 0;
const facturas_service_1 = require("../services/facturas.service");
const get_all_facturas_controller = (req, res) => { (0, facturas_service_1.get_all_facturas_service)(req, res); };
exports.get_all_facturas_controller = get_all_facturas_controller;
const get_all_facturas_actives = (req, res) => { (0, facturas_service_1.get_facturas_actives)(req, res); };
exports.get_all_facturas_actives = get_all_facturas_actives;
const get_all_facturas_ = (req, res) => { (0, facturas_service_1.get_facturas_all)(req, res); };
exports.get_all_facturas_ = get_all_facturas_;
const get_cajas_controller_Guardia = (req, res) => { (0, facturas_service_1.get_cajas_one_fact_Guardia)(req, res); };
exports.get_cajas_controller_Guardia = get_cajas_controller_Guardia;
const toTransito_controller = (req, res) => { (0, facturas_service_1.change_transito_service)(req, res); };
exports.toTransito_controller = toTransito_controller;
const getTransFact_controller = (req, res) => { (0, facturas_service_1.get_facturas_en_transito)(req, res); };
exports.getTransFact_controller = getTransFact_controller;
const postFotos_controller = (req, res) => { (0, facturas_service_1.subir_fotos)(req, res); };
exports.postFotos_controller = postFotos_controller;
const getHistoFact_controller = (req, res) => { (0, facturas_service_1.getHistoFact_service)(req, res); };
exports.getHistoFact_controller = getHistoFact_controller;
const getCajasFAct_controller_Entregador = (req, res) => { (0, facturas_service_1.getCajasOneFact_service_Entregador)(req, res); };
exports.getCajasFAct_controller_Entregador = getCajasFAct_controller_Entregador;
const getAdminFacts_controller = (req, res) => { (0, facturas_service_1.getAdminFacts_service)(req, res); };
exports.getAdminFacts_controller = getAdminFacts_controller;
const toNullState_controller = (req, res) => { (0, facturas_service_1.change_state_to_null)(req, res); };
exports.toNullState_controller = toNullState_controller;
//---------------------- ADMINI ROUTE -------------------//
const forceFactura_controller = (req, res) => { (0, facturas_service_1.forceFactura_service)(req, res); };
exports.forceFactura_controller = forceFactura_controller;
const blockFacturas_controller = (req, res) => { (0, facturas_service_1.BlockFacturas_service)(req, res); };
exports.blockFacturas_controller = blockFacturas_controller;
const unblockFacturas_controller = (req, res) => { (0, facturas_service_1.unBlockFacturas_service)(req, res); };
exports.unblockFacturas_controller = unblockFacturas_controller;
