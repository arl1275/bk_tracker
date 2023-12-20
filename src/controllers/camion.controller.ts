
// import { update_truck,
//     Get_route_truck,
//     Get_all_tracks,
//     get_day_track_one_truc,
//     get_day_track} from "../services/consolidados.service"
    
import { Request, Response } from "express";
import { get_all_camiones_service, get_camion_by_id_service, post_new_camion_service,
        update_placa_camion_service, update_QR_camion_service, delete_one_camion_service } from "../services/camion.service";

export const get_all_camiones = (req: Request, res : Response) => {get_all_camiones_service(req, res)};

export const get_one_camion_by_id_controller = (req: Request, res : Response) => {get_camion_by_id_service(req, res)};

export const post_new_camion_controller = (req: Request, res : Response) => {post_new_camion_service(req, res)};

export const update_placa_camion_controller = (req: Request, res : Response) => {update_placa_camion_service(req, res)};

export const update_QR_camion_controller = (req: Request, res : Response) => {update_QR_camion_service(req, res)};

export const delete_one_camion_controller = (req: Request, res : Response) => {delete_one_camion_service(req, res)};

