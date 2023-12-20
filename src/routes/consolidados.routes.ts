const express = require('express');
const routerConsolidados = express.Router();
import {generate_new_consolidado_controller, get_consolidado_id_controller, get_all_consolidados_controller} from '../controllers/consolidado.controller';

routerConsolidados.get('/getIdConsolidado', get_consolidado_id_controller);

routerConsolidados.post('/postNewConsolidado', generate_new_consolidado_controller);

routerConsolidados.get('/allConsolidados', get_all_consolidados_controller);

export default routerConsolidados;