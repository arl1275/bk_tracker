import { Request, Response } from "express";
import {
    get_all_facturas_service,
    get_all_factiras_in_null_state_service, insert_data_for_test,
    facturas_with_consolidado_service,
    facturas_with_EnPreparacion_state,
    facturas_with_EnTransito_state,
    getMaster_Facturas_service,
    get_boxesOneFact_service
} from "../services/facturas.service";


export const get_all_facturas_controller = (req: Request, res: Response) => { get_all_facturas_service(req, res) };

export const get_all_facturas_in_null_state_controller = (req: Request, res: Response) => { get_all_factiras_in_null_state_service(req, res) };

export const insert_fact_test = (req: Request, res: Response) => { insert_data_for_test(req, res) };

export const get_all_facturas_with_deliver_controller = (req: Request, res: Response) => { facturas_with_consolidado_service(req, res) };

export const get_all_Enpreparacion_fact_service = (req: Request, res: Response) => { facturas_with_EnPreparacion_state(req, res) };

export const get_all_EnTransito_fact_Controller = ( req : Request, res : Response) => { facturas_with_EnTransito_state(req, res) };

export const get_all_master_facturas_controller  = (req : Request, res : Response) => {getMaster_Facturas_service(req, res)};

export const get_boxes_oneFact = (req : Request, res : Response) => { get_boxesOneFact_service(req, res) };