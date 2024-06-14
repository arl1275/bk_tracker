"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnblockDecEnv_controller = exports.BlockDecEnv_controller = exports.getDecEnv_appEncabezado = exports.getDecEnv_appService = exports.putDecEnv_controller = exports.getFactsDecEnv = exports.putDecEnv = exports.postNewDecEnv_controller = exports.getDecEnv_controller = void 0;
const declaracion_env_service_1 = require("../services/declaracion_env.service");
const getDecEnv_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.getDecEnvios_service)(req, res); });
exports.getDecEnv_controller = getDecEnv_controller;
const postNewDecEnv_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.postNewDecEnv_service)(req, res); });
exports.postNewDecEnv_controller = postNewDecEnv_controller;
const putDecEnv = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.putDecEnv_serive)(req, res); });
exports.putDecEnv = putDecEnv;
const getFactsDecEnv = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.getFacts_one_dec)(req, res); });
exports.getFactsDecEnv = getFactsDecEnv;
const putDecEnv_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.putDecEnv_service)(req, res); });
exports.putDecEnv_controller = putDecEnv_controller;
const getDecEnv_appService = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.getDecEnv_serive)(req, res); });
exports.getDecEnv_appService = getDecEnv_appService;
const getDecEnv_appEncabezado = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.getDecEnv_appEncabezadoService)(req, res); });
exports.getDecEnv_appEncabezado = getDecEnv_appEncabezado;
const BlockDecEnv_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.BlockDeclaraciones_service)(req, res); });
exports.BlockDecEnv_controller = BlockDecEnv_controller;
const UnblockDecEnv_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () { (0, declaracion_env_service_1.unBlockdeclaraciones_service)(req, res); });
exports.UnblockDecEnv_controller = UnblockDecEnv_controller;
