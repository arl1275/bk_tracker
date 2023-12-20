import { Request, Response } from "express";
import { generate_void_entrega, get_all_entregas, get_entrega_by_id, toCargandoService,
toTransitoService, toSincronizadoService } from "../services/entregas.service";

//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------

export let get_all_entregas_controller = ( req : Request, res : Response) => {get_all_entregas(req, res)};

export let get_entrega_by_id_controller = (req: Request, res : Response) => {get_entrega_by_id(req, res)};

export let gen_void_entrega_con = (req : Request, res : Response) =>{generate_void_entrega(req, res)};

//----------------------------------------------------
//          STATE FUNCTIONS
//----------------------------------------------------

export let entregatoCargandoController = (req : Request, res : Response) =>{toCargandoService(req, res)};

export let entregatoTransitoController = (req : Request, res : Response) =>{toTransitoService(req, res)};

export let entregatoSincronizarController = (req : Request, res : Response) =>{toSincronizadoService(req, res)};