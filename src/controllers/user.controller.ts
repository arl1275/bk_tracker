import { Request, Response } from "express";
import {
        get_all_entregadores_service,
        CreateUserService,
        DelUser,
        getAllUsuarios,
        UpdateUserService,
        passUser_service,
        passUser_appService
} from "../services/user.service";

// //routes thay we need

export const get_all_entregadores = (req: Request, res: Response) => { get_all_entregadores_service(req, res) }; //loggin access

export const log_controller = (req: Request, res : Response) =>{passUser_service(req, res)};

export const create_User = (req: Request, res: Response) => { CreateUserService(req, res) };

export const delete_User = (req: Request, res: Response) => { DelUser(req, res) };

export const update_user = (req: Request, res: Response) => { UpdateUserService(req, res) };

export const log_appController = (req : Request, res : Response) => { passUser_appService(req, res)};

// export const update_user_role = (req: Request, res : Response) =>{update_role(req, res)};

// //admin routes

export const see_all_users = (req: Request, res: Response) => { getAllUsuarios(req, res) };

