import { Request, Response } from "express";
import connDB from "../utils/psql_connection";
const format = require('pg-format')

export const generate_consolidation_service = async (req: Request, res: Response) => {
    try {
        const { camion, entregador, pais, transportista, facturas } = req.body;
        const query = "SELECT crear_consolidado($1, $2, $3, $4, $5);";
        const ent = parseInt(entregador[0]);
        const cam = parseInt(camion[0]);
        const values = facturas.map((factura: any) => [ent, transportista, cam, pais, factura.id]);
        
        // const val_ref = values[0].factura.id * 90;
        // console.log('data ref : ', val_ref);

        //  connDB.query(`
        //  INSERT INTO
        //  envios (ref_envio, handler_type, validado_final) 
        //  values('${val_ref}', 'COD_BARRAS', false) returning id;`, (err, result)=>{
        //      if(!err){
        //          console.log('respuesta del query : ', result.rows)
        //          return result.rows;
        //      }else{
        //          console.log('NO SE CREO EL ENVIO')
        //      }
        //  })
        


        
        let errorOccurred = false; 

         for (let i = 0; i < values.length; i++) {
             await new Promise<void>((resolve, reject) => {
                 connDB.query(query, values[i], (err, result) => {
                     if (err) {
                         console.error('Error al ejecutar la consulta:', err);
                         errorOccurred = true;
                     }
                     resolve();
                 });
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