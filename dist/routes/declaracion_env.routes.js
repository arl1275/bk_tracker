"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const declaracion_env_controller_1 = require("../controllers/declaracion_env.controller");
const routerDec_env = express.Router();
routerDec_env.get('/getDecEnv', declaracion_env_controller_1.getDecEnv_controller);
routerDec_env.post('/NewDecEnv', declaracion_env_controller_1.postNewDecEnv_controller);
routerDec_env.put('/closeDecEnv', declaracion_env_controller_1.putDecEnv);
routerDec_env.get('/FactsDecEnv', declaracion_env_controller_1.getFactsDecEnv);
routerDec_env.put('/putDecEnv', declaracion_env_controller_1.putDecEnv_controller);
routerDec_env.get('/app/getDec_env', declaracion_env_controller_1.getDecEnv_appService);
routerDec_env.get('/app/getEncabezado', declaracion_env_controller_1.getDecEnv_appEncabezado);
//----------------------- this is to block ------------------------//
routerDec_env.post('/admin/blockDec', declaracion_env_controller_1.BlockDecEnv_controller);
routerDec_env.post('/admin/UnblockDecs', declaracion_env_controller_1.UnblockDecEnv_controller);
exports.default = routerDec_env;
