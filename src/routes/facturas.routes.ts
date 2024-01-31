const express = require('express')
import { Request, Response } from "express";
import {
        get_all_facturas_controller,
        get_all_facturas_actives,
        get_all_facturas_,
        get_cajas_controller,
        toTransito_controller,
        getTransFact_controller,
        postFotos_controller,
        getHistoFact_controller,
        getCajasFAct_controller,
        getAdminFacts_controller
} from "../controllers/facturas.controller";

const routerFacturas = express.Router();

// get all facturas without state
routerFacturas.get('/get_all_facturas', get_all_facturas_controller);//

// get all facturas actives NO USED
routerFacturas.get('/get_all_actives', get_all_facturas_actives);

// get all facturas 
routerFacturas.get('/getallfacts', get_all_facturas_);

// get the cajas of one factura
routerFacturas.get('/getCajas', get_cajas_controller);

//change factura to transito
routerFacturas.put('/toTransito', toTransito_controller);

// to get facturas in transito
routerFacturas.get('/getEnTransFact', getTransFact_controller);

// sincronizar y subir fotos
routerFacturas.put('/SubirFotosFact', postFotos_controller); //         /facturas/SubirFotosFact

routerFacturas.get('/getFactActives', get_all_facturas_actives);

routerFacturas.get('/getHistoFact', getHistoFact_controller);

routerFacturas.get('/adminFact', getAdminFacts_controller);

// para sincronizar cajas en la app
routerFacturas.get('/app/getCajasOneFact', getCajasFAct_controller);

export default routerFacturas;