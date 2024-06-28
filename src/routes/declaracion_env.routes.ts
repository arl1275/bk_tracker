const express = require('express')
import {
    getDecEnv_controller,
    postNewDecEnv_controller,
    putDecEnv,
    getFactsDecEnv,
    putDecEnv_controller,
    getDecEnv_appService,
    getDecEnv_appEncabezado,
    UnblockDecEnv_controller,
    BlockDecEnv_controller,
    getFacts_controller
} from "../controllers/declaracion_env.controller";
const routerDec_env = express.Router();

routerDec_env.get('/getDecEnv', getDecEnv_controller);

routerDec_env.post('/NewDecEnv', postNewDecEnv_controller);

routerDec_env.put('/closeDecEnv', putDecEnv);

routerDec_env.get('/FactsDecEnv', getFactsDecEnv);

routerDec_env.put('/putDecEnv', putDecEnv_controller);

routerDec_env.get('/app/getDec_env', getDecEnv_appService);

routerDec_env.get('/app/getEncabezado', getDecEnv_appEncabezado);

routerDec_env.get('/getfactsdec', getFacts_controller);

//----------------------- this is to block ------------------------//

routerDec_env.post('/admin/blockDec', BlockDecEnv_controller );

routerDec_env.post('/admin/UnblockDecs', UnblockDecEnv_controller);

export default routerDec_env;