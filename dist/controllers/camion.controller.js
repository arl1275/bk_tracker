"use strict";
// import { update_truck,
//     Get_route_truck,
//     Get_all_tracks,
//     get_day_track_one_truc,
//     get_day_track} from "../services/consolidados.service"
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_one_camion_controller = exports.update_QR_camion_controller = exports.update_placa_camion_controller = exports.post_new_camion_controller = exports.get_one_camion_by_id_controller = exports.get_all_camiones = void 0;
const camion_service_1 = require("../services/camion.service");
const get_all_camiones = (req, res) => { (0, camion_service_1.get_all_camiones_service)(req, res); };
exports.get_all_camiones = get_all_camiones;
const get_one_camion_by_id_controller = (req, res) => { (0, camion_service_1.get_camion_by_id_service)(req, res); };
exports.get_one_camion_by_id_controller = get_one_camion_by_id_controller;
const post_new_camion_controller = (req, res) => { (0, camion_service_1.post_new_camion_service)(req, res); };
exports.post_new_camion_controller = post_new_camion_controller;
const update_placa_camion_controller = (req, res) => { (0, camion_service_1.update_placa_camion_service)(req, res); };
exports.update_placa_camion_controller = update_placa_camion_controller;
const update_QR_camion_controller = (req, res) => { (0, camion_service_1.update_QR_camion_service)(req, res); };
exports.update_QR_camion_controller = update_QR_camion_controller;
const delete_one_camion_controller = (req, res) => { (0, camion_service_1.delete_one_camion_service)(req, res); };
exports.delete_one_camion_controller = delete_one_camion_controller;
//# sourceMappingURL=camion.controller.js.map