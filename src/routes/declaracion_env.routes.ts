const express = require('express')
import { Request, Response } from "express";
import {
    getDecEnv_controller,
    postNewDecEnv_controller,
    putDecEnv,
    getFactsDecEnv,
    putDecEnv_controller
} from "../controllers/declaracion_env.controller";
const routerDec_env = express.Router();

routerDec_env.get('/getDecEnv', getDecEnv_controller);

routerDec_env.post('/NewDecEnv', postNewDecEnv_controller);

routerDec_env.put('/closeDecEnv', putDecEnv);

routerDec_env.get('/FactsDecEnv', getFactsDecEnv);

routerDec_env.put('/putDecEnv', putDecEnv_controller);

export default routerDec_env;