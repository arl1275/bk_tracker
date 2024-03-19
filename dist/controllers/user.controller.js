"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.see_all_users = exports.authCheck_controller = exports.log_appController = exports.update_user = exports.delete_User = exports.create_User = exports.log_controller = exports.get_all_entregadores = void 0;
const user_service_1 = require("../services/user.service");
// //routes thay we need
const get_all_entregadores = (req, res) => { (0, user_service_1.get_all_entregadores_service)(req, res); }; //loggin access
exports.get_all_entregadores = get_all_entregadores;
const log_controller = (req, res) => { (0, user_service_1.passUser_service)(req, res); };
exports.log_controller = log_controller;
const create_User = (req, res) => { (0, user_service_1.CreateUserService)(req, res); };
exports.create_User = create_User;
const delete_User = (req, res) => { (0, user_service_1.DelUser)(req, res); };
exports.delete_User = delete_User;
const update_user = (req, res) => { (0, user_service_1.UpdateUserService)(req, res); };
exports.update_user = update_user;
const log_appController = (req, res) => { (0, user_service_1.passUser_appService)(req, res); };
exports.log_appController = log_appController;
const authCheck_controller = (req, res) => { (0, user_service_1.authCheck_service)(req, res); };
exports.authCheck_controller = authCheck_controller;
// //admin routes
const see_all_users = (req, res) => { (0, user_service_1.getAllUsuarios)(req, res); };
exports.see_all_users = see_all_users;
