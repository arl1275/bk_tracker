"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const facturas_controller_1 = require("../controllers/facturas.controller");
const routerFacturas = express.Router();
// get all facturas without state
routerFacturas.get('/get_all_facturas', facturas_controller_1.get_all_facturas_controller); //
// get all facturas actives NO USED
routerFacturas.get('/get_all_actives', facturas_controller_1.get_all_facturas_actives);
// get all facturas 
routerFacturas.get('/getallfacts', facturas_controller_1.get_all_facturas_);
// get the cajas of one factura
routerFacturas.get('/getCajas', facturas_controller_1.get_cajas_controller);
//change factura to transito
routerFacturas.put('/toTransito', facturas_controller_1.toTransito_controller);
// to get facturas in transito
routerFacturas.get('/getEnTransFact', facturas_controller_1.getTransFact_controller);
// sincronizar y subir fotos
routerFacturas.put('/SubirFotosFact', facturas_controller_1.postFotos_controller); //         /facturas/SubirFotosFact
routerFacturas.get('/getFactActives', facturas_controller_1.get_all_facturas_actives);
routerFacturas.get('/getHistoFact', facturas_controller_1.getHistoFact_controller);
routerFacturas.get('/adminFact', facturas_controller_1.getAdminFacts_controller);
// para sincronizar cajas en la app
routerFacturas.get('/app/getCajasOneFact', facturas_controller_1.getCajasFAct_controller);
routerFacturas.get('/toNullState', facturas_controller_1.toNullState_controller);
//------------------------------------------------- THIS IS A ADMINISTRATOR ROUTE -------------------------------------------------//
routerFacturas.post('/admin/forceSyncroFact', facturas_controller_1.forceFactura_controller); // this route is to force the incronization of one factura
//routerFacturas.get('/admin/force', forceFactura_controller);
//---------------------------------------------------------------------------------------------------------------------------------//
exports.default = routerFacturas;
