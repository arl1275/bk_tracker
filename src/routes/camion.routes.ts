

const express = require('express');
const routerFacturas = express.Router();
// controller import 
import {
        get_all_camiones,
        get_one_camion_by_id_controller,
        post_new_camion_controller,
        delete_one_camion_controller,
        update_placa_camion_controller,
        update_QR_camion_controller
} from "../controllers/camion.controller";

routerFacturas.get('/get_all_camiones', get_all_camiones);

routerFacturas.get('/getoneCamion', get_one_camion_by_id_controller);

routerFacturas.post('/postNewCamion', post_new_camion_controller);

routerFacturas.put('/updatePlaca', update_placa_camion_controller);

routerFacturas.put('/updateQR', update_QR_camion_controller);

routerFacturas.delete('/DeloneCamion', delete_one_camion_controller);

export default routerFacturas;

