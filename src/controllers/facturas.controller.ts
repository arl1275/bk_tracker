import { Request, Response } from "express";
import {
    get_all_facturas_service,
    get_facturas_actives,
    get_facturas_all,
    get_cajas_one_fact_Guardia,
    change_transito_service,
    get_facturas_en_transito,
    subir_fotos,
    getHistoFact_service,
    getCajasOneFact_service_Entregador,
    getAdminFacts_service,
    change_state_to_null,
    forceFactura_service,
    BlockFacturas_service,
    unBlockFacturas_service,
    getCajasFactura_service,
    FinalizarFactura_Service
} from "../services/facturas.service";


export const get_all_facturas_controller = (req: Request, res: Response) => { get_all_facturas_service(req, res) };

export const get_all_facturas_actives = (req: Request, res: Response) => { get_facturas_actives(req, res) };

export const get_all_facturas_ = (req: Request, res: Response) => { get_facturas_all(req, res) };

export const get_cajas_controller_Guardia =  (req: Request, res: Response) => { get_cajas_one_fact_Guardia(req, res) };

export const toTransito_controller = (req: Request, res: Response) => { change_transito_service(req, res) };

export const getTransFact_controller = (req: Request, res: Response) => {  get_facturas_en_transito(req, res) };

export const postFotos_controller = (req: Request, res: Response) => { subir_fotos(req, res)};

export const getHistoFact_controller = (req: Request, res: Response) => { getHistoFact_service(req, res)};

export const getCajasFAct_controller_Entregador = (req: Request, res: Response) => { getCajasOneFact_service_Entregador(req, res)};

export const getAdminFacts_controller = (req: Request, res: Response) => { getAdminFacts_service(req, res)};

export const toNullState_controller = ( req : Request, res : Response ) => { change_state_to_null(req, res)};

export const getCajasFactura_controller =  ( req : Request, res : Response ) => { getCajasFactura_service(req, res)};

//---------------------- ADMINI ROUTE -------------------//

export const forceFactura_controller = ( req : Request, res : Response ) => { forceFactura_service( req, res )}

export const blockFacturas_controller = ( req : Request, res : Response) => { BlockFacturas_service(req, res)}

export const unblockFacturas_controller  = ( req : Request, res : Response) => { unBlockFacturas_service(req, res)}

export const FinalizarFactura_controller = ( req : Request, res : Response) => { FinalizarFactura_Service(req, res)}




