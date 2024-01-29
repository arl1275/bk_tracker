import { Request, Response } from "express";
import { generate_dec_env } from "../utils/queries/works_querys";
import connDB from "../utils/db/localDB_config";
import format from "pg-format";
import { factura } from "../interfaces/db_interfeces/Axproveider";

export const postNewDecEnv_service = async (req: Request, res: Response) => {
    try {
        const { declaracion_env, id_cam, id_user } = req.body;
        let _id_: number = 0;
        // primero creamos la declaracion de envio y guardamos el ID
        const result = await new Promise((resolve, reject) => {
            connDB.query(generate_dec_env(), [id_cam, id_user], (err, result) => {
                if (err) {
                    console.log('OCURRIO UN ERROR AL CREAR DECLARACION ENVIO : ', err);
                    reject(err);
                } else {
                    console.log('SE CREO LA DECLARACION DE ENVIO');
                    _id_ = result.rows[0].id;
                    resolve(result);
                }
            });
        });

        if (_id_ != 0 ) {
            let query = 'SELECT * FROM refers_to_dec_envio( $1, $2 );';
            let error: boolean = false;

            for (let i = 0; i < declaracion_env.length; i++) {
                // this is to referes to the dec_envio
                const element = declaracion_env[i];
                console.log('REFERENCIAS PARA DEC_ENV: ', element.factura, _id_);

                try {
                    await new Promise((resolve, reject) => {
                        connDB.query(query, [element.factura, _id_], (err, result) => {
                            if (err) {
                                console.log('ERROR PARA REFERENCIAR LAS FACTURAS : ', err);
                                error = true;
                                reject(err);
                            } else {
                                console.log('SE GENERO REFERENCIAR LAS FACTURAS');
                                resolve(result);
                            }
                        });
                    });

                // this is to create entregas
                const create_entreaga_by_factura = 'SELECT * FROM change_state_to_enPreparacion($1);';
                await new Promise((resolve, reject) => {
                    connDB.query(create_entreaga_by_factura, [element.factura], (err, result) => {
                        if (err) {
                            console.log('ERROR PARA REFERENCIAR LAS FACTURAS : ', err);
                            error = true;
                            reject(err);
                        } else {
                            console.log('SE GENERO REFERENCIAR LAS FACTURAS');
                            resolve(result);
                        }
                    });
                });


                } catch (err) {
                    // Handle specific error if needed
                }
            }

            if (error === false) {
                res.status(200).json({ message: 'SE CREO LAS REFERENCIAS Y DECLARACION' });
            } else {
                res.status(500).json({ message: 'NO CREO LAS REFERENCIAS Y DECLARACION' });
            }
        } else {
            console.log('no se genero el id de declaracion de envio : ', _id_);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'NO SE PUDO INGRESAR LA DECLARACION DE ENVIO' });
    }
};

// no in use
export const getDecEnv_serive = async ( req : Request, res : Response) => {
    try {
        const query = 'SELECT * FROM get_dec_env();';
        connDB.query(query, (err, result) =>{
            if(err){
                console.log('NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO : ', err);
                res.status(500).json({ message : 'NO SE OBTENER LAS DEC_ENVIOS'})
            }else{
                console.log('SE OBTUBIERON LAS DECLARACIONES DE ENVIO');
                res.status(200).json({ data : result.rows });
            }
        })
    } catch (err) {
        console.log('SE OBTUBIERON LAS DECLARACIONES DE ENVIO : ', err);
        res.status(500).json({ message : 'NO SE OBTENER LAS DEC_ENVIOS'}) 
    }   
}

export const putDecEnv_serive =async ( req : Request, res : Response) => {
    try {
        
    } catch (err) {
        
    }
}
// en uso
export const getFacts_one_dec =async (  req : Request, res : Response ) => {
    try {
        const {dec_envio} = req.query;
        
        if(typeof dec_envio === 'string'){
            let nuew= parseInt(dec_envio);
            //console.log('paso : ', nuew);
            const query = 'select * from getFacts_one_DecEnv($1);';
            connDB.query(query, [nuew], (err, result)=>{
                if(err){
                    console.log('ERROR OBTENIENDO LAS FACTURAS DE LA DECLARACION DE ENVIO : ', err);
                    res.status(500).json({ message : 'ERROR OBTENIENDO LAS FACTURAS DE LA DECLARACION DE ENVIO'})
                }else{
                    console.log('SE OBTubieron LAS FACTURAS DE LA DECLARACION DE ENVIO');
                    //console.log(result.rows);
                    res.status(200).json({ data : result.rows});
                }
            })
        }
        
        
    } catch (err) {
        console.log('ERROR AL OBTENENER RUTA DE FACTURAS : ', err);
        res.status(500).json({ message : 'error para obtener las facturas'})
    }
}

// en uso
export const getDecEnvios_service =async (req : Request , res : Response) => {
    try {
        const query = 'SELECT * FROM get_dec_envio_info();';
        connDB.query(query, (err, result)=>{
            if(err){
                console.log('ERROR PARA OBTENER DECLARACIONES ENVIO : ', err);
                res.status(500).json({ message : 'NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO'});
            }else{
                console.log('SE OBTUBO LAS DECLARACIONES DE ENVIO');
                res.status(200).json({ data : result.rows});
            }
        })
    } catch (err) {
        console.log('NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO', err);
        res.status(500).json({ message : 'NO SE PUDO OBTENER LAS DECLARACIONES DE ENVIO'});
    }
}

//en uso
export const putDecEnv_service =async ( req : Request , res : Response ) => {
    try {
        const data = req.body;
        console.log('=0=>', data);
        const query = 'SELECT * FROM set_change_decenvio($1, $2, $3);';
        connDB.query(query, [data.cam, data.use, data.decenv], (err, result)=>{
            if(err){
                console.log('NO SE PUDO HACER EL CAMBIO', err);
                res.status(500).json({ message : 'NO SE PUDO HACER CAMBIO DE LA DECLARACIONES DE ENVIO'});
            }else{
                console.log('SE HIZO CAMBIO DE DECLARACION DE ENVIO');
                res.status(200).json({ message : 'SE HIZO CAMBIO DE DECLARACION DE ENVIO'});
            }
        })
    } catch (err) {
        console.log('NO SE PUDO OBTER RUTA LAS DECLARACIONES DE ENVIO', err);
        res.status(500).json({ message : 'NO SE PUDO OBTENER RUTA LAS DECLARACIONES DE ENVIO'});
    }
}