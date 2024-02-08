"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const routerFacturas = express.Router();
// controller import 
const camion_controller_1 = require("../controllers/camion.controller");
routerFacturas.get('/get_all_camiones', camion_controller_1.get_all_camiones);
routerFacturas.get('/getoneCamion', camion_controller_1.get_one_camion_by_id_controller);
routerFacturas.post('/postNewCamion', camion_controller_1.post_new_camion_controller);
routerFacturas.put('/updatePlaca', camion_controller_1.update_placa_camion_controller);
routerFacturas.put('/updateQR', camion_controller_1.update_QR_camion_controller);
routerFacturas.delete('/DeloneCamion', camion_controller_1.delete_one_camion_controller);
exports.default = routerFacturas;
