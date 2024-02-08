"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const routerEntregas = express.Router();
const entregas_controller_1 = require("../controllers/entregas.controller");
//general functions
routerEntregas.get('/entregas', entregas_controller_1.get_all_entregas_controller);
routerEntregas.get('/id_entregas', entregas_controller_1.get_entrega_by_id_controller);
routerEntregas.post('/genEntregas', entregas_controller_1.gen_void_entrega_con);
// state functions
routerEntregas.put('/toPreparacion', entregas_controller_1.entregatoCargandoController);
routerEntregas.put('/toTransito', entregas_controller_1.entregatoTransitoController); // /entregas/toTransito
routerEntregas.put('/toSincronizar', entregas_controller_1.entregatoSincronizarController); // /entregas/toSincronizar
// pics functions
routerEntregas.get('/getFactPics', entregas_controller_1.getPicsOneFactController);
exports.default = routerEntregas;
