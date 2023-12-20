import { Request, Response } from "express";
import {
        get_all_tranportistas_service,
        get_one_transportista_info_by_id_service,
        generate_consolidados_transportista_service,
        get_all_info_one_consTransportista_service,
        createTransportista,
        DelTransportista
} from "../services/transportistas.service";

export let get_all_tranportistas = (req: Request, res: Response) => { get_all_tranportistas_service(req, res) };

export let get_all_info_from_one_conTransportista = (req: Request, res: Response) => { get_one_transportista_info_by_id_service(req, res) }

export let post_one_consolidate_transportistas_controller = (req: Request, res: Response) => { generate_consolidados_transportista_service(req, res) };

export let get_all_info_of_one_conTransportista_controller = (req: Request, res: Response) => { get_all_info_one_consTransportista_service(req, res) };

export let createNewTransportista = (req: Request, res : Response) => {createNewTransportista(req, res)};

export let DelTransportistaController = (req : Request, res : Response) => {DelTransportista(req, res)};
