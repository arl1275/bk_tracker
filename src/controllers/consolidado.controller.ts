import { Response, Request } from "express";
//import connDB from "../../DBconnection/tracker_db";
//import { error } from "console";
import { generate_consolidation_service, get_consolidado_by_id_service, get_all_consolidados } from "../services/consolidados.service";

export let generate_new_consolidado_controller = (req: Request, res: Response) => {generate_consolidation_service(req, res)};

export let get_consolidado_id_controller = (req : Request, res : Response) => {get_consolidado_by_id_service(req, res)};

export let get_all_consolidados_controller = (req : Request, res : Response) => {get_all_consolidados_controller(req, res)};