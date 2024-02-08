"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerUser = (0, express_1.Router)();
const user_controller_1 = require("../controllers/user.controller");
// //admin routes
routerUser.get("/entregadores", user_controller_1.get_all_entregadores); //get all users
// //user routes
routerUser.get("/getallUsers", user_controller_1.see_all_users); //get into a page. /user/getallUsers
routerUser.post("/createuser", user_controller_1.create_User);
routerUser.delete("/deleteuser:", user_controller_1.delete_User);
routerUser.put("/update_user", user_controller_1.update_user); // /usuarios/update_user
routerUser.get("/auth/user", user_controller_1.log_controller);
routerUser.get("/auth/app", user_controller_1.log_appController); //usuarios/auth/app
// routerUser.get("/EMER:", Emergency_log);
exports.default = routerUser;
