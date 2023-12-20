const express = require('express')
import { Request, Response } from "express";
import {
        get_all_facturas_controller,
        get_all_facturas_in_null_state_controller
        , insert_fact_test,
        get_all_facturas_with_deliver_controller,
        get_all_Enpreparacion_fact_service,
        get_all_EnTransito_fact_Controller,
        get_all_master_facturas_controller
} from "../controllers/facturas.controller";

const routerFacturas = express.Router();


// this will send all the invoices that where made, without taken "state in consideration"
routerFacturas.get('/get_all_facturas', get_all_facturas_controller);//

// will return all invoices in "null" state (the new invoices created)
routerFacturas.get('/get_all_facturas_in_null_state', get_all_facturas_in_null_state_controller);

// will return all invoices in "En Preparacion" state
routerFacturas.get('/getFacturasWithEntrega', get_all_facturas_with_deliver_controller);

routerFacturas.get('/factEnPreparacion', get_all_Enpreparacion_fact_service);

// will return all invoices in "Cargando" state
routerFacturas.get('/get_all_invoices_with_only_Cargando_state');

// will return all invoices in "En Transito" state
routerFacturas.get('/getFacturasEnTransito', get_all_EnTransito_fact_Controller);

// will return all invoices in "Sincronizado" state
routerFacturas.get('/get_all_invoices_with_only_Sincronizado_state');

routerFacturas.get('/get_all_information_of_one_invoice');

routerFacturas.get('/get_validate_inovoice_state');

//just for develop things
routerFacturas.post('/test_insert', insert_fact_test);

//ADMIN VIEW
routerFacturas.get('/adminFact', get_all_master_facturas_controller);


export default routerFacturas;