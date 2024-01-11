import { Request, Response } from "express";
import { factura_form } from "../interfaces/factura.interface";
import { get_all_facturas_without_state } from "../utils/query_provider";
import connDB from "../utils/psql_connection";
import format from "pg-format";

//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------

export let get_all_facturas_service = async (req: Request, res: Response) => {
    try {
        connDB.query('SELECT * FROM facturas;', (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
            } else {
                res.status(200).json({ data: result.rows });
                console.log('Se obtubieron todas las facturas');
            }
        });
    } catch (err) {
        console.log("NO SE PUDO REALIZAR LA PETICION DE LAS FACTURAS")
    }
};

export let get_all_factiras_in_null_state_service = async (req: Request, res: Response) => {
    try {
        connDB.query(get_all_facturas_without_state, (err, result) => {
            if (err) {
                console.log('Error executing query:', err);
                res.status(500).json({ error: 'error al ejecutar query' });
            } else {
                res.status(200).json({ data: result.rows });
                console.log("SE OBTUBIERON TODAS LAS FACTURAS SIN CONSOLIDAR");
            }
        });
    } catch (err) {
        res.status(500).json({ data: err });
    }
};

export let insert_data_for_test = async (req: Request, res: Response) => {
    let response;
    const insertquery = 'SELECT * FROM createfact($1, $2, $3)';
    const { ref_factura, cliente, cant_cajas, cant_unidades, list_empaque, ubicacion } = req.body;
    try {
        //console.log('datos a ingresar: ', req.body);
        connDB.query(insertquery, [ref_factura, cant_cajas, cant_unidades], (err, result) => {
            if (err || result.rows === null) {
                console.log('NO SE PUDO INSERTAR EN FACTURAS', err);
                res.status(500).json({ message: 'no se pudo ingresar factura' });
            } else {
                console.log('SE INGRESO FACTURA');
                res.status(200).json({ message: 'SE INGRESO LA FACTURA' });
            }
        })
    } catch (err) {
        res.status(500).json({ data: err });
        console.log('NO INGRESO A LA INSERCION DE FACTURAS');
    }
}

//----------------------------------------------------
//    Functions to get Facts in different states
//----------------------------------------------------

export let getMaster_Facturas_service = async (req: Request, res: Response) => {
    const query = format('SELECT * FROM get_all_facturas_status();');
    try {
        connDB.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'IMPOSIBLE OBTENER TODAS LAS FACTURAS: ', err });
            } else {
                console.log("SE OBTUBIERON TODAS LAS FACTURAS DESDE LA VISTA ADMIN");
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (err) {
        console.log('NO SE PUDO INGRESAR A LA RUTA');
        res.status(500).json({ mesage: 'ERROR AL OBTENER RUTA' })
    }
}

export let facturas_with_consolidado_service = async (req: Request, res: Response) => {
    const query = 'SELECT * FROM get_all_facturas_in_process();';
    try {
        connDB.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'IMPOSIBLE OBTENER facturas: ', err });
            } else {
                console.log("SE OBTUBIERON TODAS LAS FACTURAS EN PROCESO")
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (err) {
        console.log('err :', err)
        res.status(500).json({ message: 'IMPOSIBLE OBTENER facturas' });
    }

}

export let facturas_with_EnPreparacion_state = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM get_all_facturas_enpreparacion();';
        connDB.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'NO SE OBTUBIERON LAS FACTURAS EN PREPARACION' });
            } else {
                console.log('SE OBTUBIERON TODAS LAS FACTURAS EN PREPARACION')
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'NO SE OBTUBIERON LAS FACTURAS EN PREPARACION' });
    }
};

export let facturas_with_EnTransito_state = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM get_all_facturas_entransito();';
        connDB.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'NO SE OBTUBIERON LAS FACTURAS EN TRANSITO' });
            } else {
                console.log('SE OBTUBIERON TODAS LAS FACTURAS EN TRANSITO')
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'NO SE OBTUBIERON LAS FACTURAS EN TRANSITO' });
    }
}

//----------------------------------------------------
//    Functions to get all in the APP
//----------------------------------------------------




