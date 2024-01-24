import { Request, Response } from "express";
import {
    get_all_facturas_service,
    get_facturas_actives,
    get_facturas_all,
    get_cajas_one_fact,
    change_transito_service,
    get_facturas_en_transito,
    subir_fotos
} from "../services/facturas.service";


export const get_all_facturas_controller = (req: Request, res: Response) => { get_all_facturas_service(req, res) };

export const get_all_facturas_actives = (req: Request, res: Response) => { get_facturas_actives(req, res) };

export const get_all_facturas_ = (req: Request, res: Response) => { get_facturas_all(req, res) };

export const get_cajas_controller =  (req: Request, res: Response) => { get_cajas_one_fact(req, res) };

export const toTransito_controller = (req: Request, res: Response) => { change_transito_service(req, res) };

export const getTransFact_controller = (req: Request, res: Response) => {  get_facturas_en_transito(req, res) };

export const postFotos_controller = (req: Request, res: Response) => { subir_fotos(req, res)};

