import { Router } from "express";
const routerUser = Router();
import { get_all_entregadores,
        create_User,
        delete_User,
        see_all_users } from "../controllers/user.controller";

// //admin routes

routerUser.get("/entregadores", get_all_entregadores); //get all users

// //user routes

routerUser.get("/getallUsers", see_all_users); //get into a page. /user/getallUsers

routerUser.post("/createuser", create_User);

routerUser.delete("/deleteuser:", delete_User);

// routerUser.put("/update_user:", update_user);

// routerUser.put("/roleUpdate:", update_user_role);

// routerUser.get("/EMER:", Emergency_log);

export default routerUser;
