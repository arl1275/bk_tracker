import { Request, Response } from "express";
import connDB from "../utils/psql_connection";
const format = require('pg-format')

export const generate_consolidation_service = async (req: Request, res: Response) => {
    try {
        const { camion, entregador, pais, transportista, facturas } = req.body;
        const query = "SELECT crear_consolidado($1, $2, $3, $4, $5, $6);";
        const ent = parseInt(entregador[0]);
        const cam = parseInt(camion[0]);
        const values = facturas.map((factura: any) => [ent, transportista, cam, pais, factura.id]);
        let ref_declaracion_envio = 0;    // this is to create the reference of Declaracion of Entrega
        let errorOccurred = false;

        for(let i = 0; i < values.length; i++){
            let x = values[i]
            ref_declaracion_envio += x[4];
            //console.log(ref_declaracion_envio);
        }

         for (let i = 0; i < values.length; i++) {
             await new Promise<void>((resolve, reject) => {
                if(ref_declaracion_envio){
                    values[i].push(ref_declaracion_envio);
                    console.log(values);
                     connDB.query(query, values[i], (err, result) => {
                         if (err) {
                             console.error('Error al ejecutar la consulta:', err);
                             errorOccurred = true;
                         }
                         resolve();
                     });
                }
             });
         }

        if (errorOccurred) {
            res.status(500).json({ message: 'No se generó el consolidado principal' });
        } else {
            console.log('Hecho el consolidado principal');
            res.status(200).json({ message: 'Se generó el consolidado de las facturas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'No se ingresó el consolidado principal:', error });
    }
}

export const get_consolidado_by_id_service = async (req: Request, res: Response) => {
    try {
        const [id] = req.body;
        const query = 'SELECT * FROM consolidados WHERE id = ($1)';
        connDB.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'error al obtener Consolidado General' });
                console.log('error al obtener Consolidado General')
            } else {
                res.status(200).json({ data: result.rows });
            }
        })//dgadf
    } catch (error) {
        res.status(500).json({ message: 'error al obtner ruta de consolidado' })
    }
}

export const get_all_consolidados = async (req: Response, res: Response) => {
    try {
        const query = 'SELECT * FROM consolidados';
        connDB.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'error al obtener todos Consolidado General' });
                console.log('error al obtener Consolidado General')
            } else {
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'error al obtner ruta de todos los consolidados' })
    }
}

//-----------------------------------------------------------

export const get_all_decalaraciones = async(req : Request, res : Response)=>{
    try {
        let query = 'SELECT * FROM get_ref_dec_envio();';
        connDB.query(query, (err, result) =>{
            if(err){
                res.status(500).json({message : ' no se pudo enviar a las declaraciones de envio'});
            }else{
                res.status(200).json({data : result.rows});
            }
        })
    }catch(err){
        console.log('ERROR AL OBTENER DECLARACIONES DE ENVIO');
        res.status(500).json({message : ' no se pudo acceder a las declaraciones de envio'});
    }
}