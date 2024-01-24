import { Request, Response } from "express";
import { getDecEnv_serive,
    postNewDecEnv_service,
    getFacts_one_dec,
putDecEnv_serive } from "../services/declaracion_env.service";

export const getDecEnv_controller = async (req: Request, res: Response) => {getDecEnv_serive(req, res)};

export const postNewDecEnv_controller =async ( req : Request, res : Response) => {postNewDecEnv_service(req, res)};

export const putDecEnv =async ( req : Request, res :Response) => { putDecEnv_serive(req, res)};

export const getFactsDecEnv = async ( req : Request, res : Response) => {  getFacts_one_dec(req, res)};