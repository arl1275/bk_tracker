import { Router } from "express";
const routerUser = Router();
import {
        get_all_entregadores,
        create_User,
        delete_User,
        see_all_users,
        update_user,
        log_controller,
        log_appController,
        authCheck_controller
} from "../controllers/user.controller";
import { authenticateToken } from '../middleware/user.middleware'

// //admin routes

routerUser.get("/entregadores", get_all_entregadores); //get all users

// //user routes

routerUser.get("/getallUsers", see_all_users); //get into a page. /user/getallUsers

routerUser.post("/createuser", create_User);

routerUser.delete("/deleteuser:", delete_User);

routerUser.put("/update_user", update_user); // /usuarios/update_user

routerUser.get("/auth/user", log_controller);

routerUser.get("/auth/app", log_appController); //usuarios/auth/app

routerUser.get("/auth/check", authenticateToken ,authCheck_controller);

export default routerUser;
