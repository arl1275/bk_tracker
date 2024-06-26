import { Request, Response } from "express";
import {
    getDecEnv_serive, // this is for app use, don't delete it
    postNewDecEnv_service,
    getFacts_one_dec,
    putDecEnv_serive,
    getDecEnvios_service,
    putDecEnv_service,
    getDecEnv_appEncabezadoService,
    BlockDeclaraciones_service,
    unBlockdeclaraciones_service,
    getFacts_service
} from "../services/declaracion_env.service";

export const getDecEnv_controller = async (req: Request, res: Response) => { getDecEnvios_service(req, res) };

export const postNewDecEnv_controller = async (req: Request, res: Response) => { postNewDecEnv_service(req, res) };

export const putDecEnv = async (req: Request, res: Response) => { putDecEnv_serive(req, res) };

export const getFactsDecEnv = async (req: Request, res: Response) => { getFacts_one_dec(req, res) };

export const putDecEnv_controller = async (req: Request, res: Response) => { putDecEnv_service(req, res) };

export const getDecEnv_appService =async (req: Request, res: Response) => { getDecEnv_serive(req, res) };

export const getDecEnv_appEncabezado =async (req: Request, res: Response) => { getDecEnv_appEncabezadoService(req, res) };

export const BlockDecEnv_controller = async ( req: Request, res: Response) => { BlockDeclaraciones_service( req, res )}

export const UnblockDecEnv_controller = async ( req : Request, res : Response) => { unBlockdeclaraciones_service( req, res)};

export const getFacts_controller = async ( req : Request, res : Response) => { getFacts_service( req, res)}


