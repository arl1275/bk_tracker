const express = require('express')
import {
        get_all_facturas_controller,
        get_all_facturas_actives,
        get_all_facturas_,
        get_cajas_controller_Guardia,
        toTransito_controller,
        getTransFact_controller,
        postFotos_controller,
        getHistoFact_controller,
        getCajasFAct_controller_Entregador,
        getAdminFacts_controller,
        toNullState_controller,
        forceFactura_controller,
        blockFacturas_controller,
        unblockFacturas_controller,
        getCajasFactura_controller,
        FinalizarFactura_controller
} from "../controllers/facturas.controller";

const routerFacturas = express.Router();

// get all facturas without state
routerFacturas.get('/get_all_facturas', get_all_facturas_controller);//

// get all facturas actives NO USED
routerFacturas.get('/get_all_actives', get_all_facturas_actives);

// get all facturas 
routerFacturas.get('/getallfacts', get_all_facturas_);

// get the cajas of one factura
routerFacturas.get('/getCajas_Guardia', get_cajas_controller_Guardia);

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
routerFacturas.post('/app/getCajasOneFact_Entregador', getCajasFAct_controller_Entregador); // /facturas/app/getCAjasOneFact  para entregador

routerFacturas.get('/toNullState', toNullState_controller);

routerFacturas.get('/getCajas', getCajasFactura_controller );


//------------------------------------------------- THIS IS A ADMINISTRATOR ROUTE -------------------------------------------------//

routerFacturas.post('/admin/forceSyncroFact', forceFactura_controller)         // this route is to force the incronization of one factura

//routerFacturas.get('/admin/force', forceFactura_controller);

//------------------------------------------------- THIS IS TO BLOCK FACTURAS  -------------------------------------------------//

routerFacturas.post('/admin/blockFacturas', blockFacturas_controller);

routerFacturas.post('/admin/unblockFacturas', unblockFacturas_controller);

routerFacturas.post('/admin/finalizarfactura', FinalizarFactura_controller);

export default routerFacturas;