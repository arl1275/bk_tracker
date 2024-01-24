const express = require('express');
const routerEntregas = express.Router();
import {
    get_all_entregas_controller, get_entrega_by_id_controller, gen_void_entrega_con, entregatoCargandoController,
    entregatoTransitoController,
    entregatoSincronizarController,
    getPicsOneFactController
} from '../controllers/entregas.controller';

//general functions

routerEntregas.get('/entregas', get_all_entregas_controller);

routerEntregas.get('/id_entregas', get_entrega_by_id_controller);

routerEntregas.post('/genEntregas', gen_void_entrega_con);


// state functions

routerEntregas.put('/toPreparacion', entregatoCargandoController);

routerEntregas.put('/toTransito', entregatoTransitoController); // /entregas/toTransito

routerEntregas.put('/toSincronizar', entregatoSincronizarController);// /entregas/toSincronizar

// pics functions

routerEntregas.get('/getFactPics', getPicsOneFactController)

export default routerEntregas;