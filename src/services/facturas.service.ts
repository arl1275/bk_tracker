import { Request, Response } from "express";
import connDB from "../utils/db/localDB_config";
import format from "pg-format";
import { factura } from "../interfaces/db_interfeces/Axproveider";
import { uploadFileToCloudinary } from "../utils/db/cloudinary_config";

//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------

// EN USO
export let get_all_facturas_service = async (req: Request, res: Response) => {
    try {
        connDB.query('SELECT * FROM resumen_facturas();', (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
            } else {
                res.status(200).json({ data: result.rows });
                //console.log('Se obtubieron todas las facturas');
            }
        });
    } catch (err) {
        console.log("NO SE PUDO REALIZAR LA PETICION DE LAS FACTURAS")
    }
};

export let get_facturas_actives = async (req: Request, res: Response) => {
    const query = format('SELECT * FROM get_facts_active();');
    try {
        connDB.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'IMPOSIBLE OBTENER TODAS LAS FACTURAS ACTIVAS: ', err });
            } else {
                console.log("SE OBTUBIERON TODAS LAS FACTURAS ACTIVAS");
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (err) {
        console.log('NO SE PUDO INGRESAR A LA RUTA');
        res.status(500).json({ mesage: 'ERROR AL OBTENER RUTA' })
    }
}

export let get_facturas_all = async (req: Request, res: Response) => {
    const query = format('SELECT * FROM resumen_all_facturas();');
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

export let change_preparacion_service = async ( req: Request, res: Response ) => {
    try {
        const {factura} = req.body;
        const lista_facturas : factura[] = factura;
        const query = 'SELECT * FROM change_state_to_enpreparacion($1);';
        let is_err;

        for (let i = 0; i < lista_facturas.length; i++) {
            const factura_ = lista_facturas[i].Factura;
            connDB.query(query, [factura_], (err, result)=>{
                if(err){
                    console.log('NO SE PUDO ENVIAR A PREPARACION : ', err);
                    is_err = true;
                }else{
                    console.log('SE ENVIO A PREPARACION : ', factura_);
                    is_err = false
                }
            })
        }

        if(is_err === true){
            res.status(500).json({ message : 'ERROR AL ENVIAR A PREPARACION'});
        }else{
            res.status(200).json({ message : 'SE ENVIARON LAS FACTURAS A PREPARACION'});
        }
        
    } catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE A PREPARACION : ', err);
        res.status(500).json({ message : 'ERROR AL ALCANZAR RUTA DE A PREPARACION'});
    }
}

//EN USO
export let change_transito_service = async ( req: Request, res: Response ) => {
    try {
        const data = req.body;
        const query = 'SELECT * FROM change_state_to_entransito($1);'; // the $1, is the referencence of the factura
        let is_err;
        //console.log(' DATA GETS : ', data, req.body);
         for (let i = 0; i < data.length; i++) {
             const factura_ = data[i];
            //console.log('fact => ', factura_)
              connDB.query(query, [factura_], (err, result)=>{
                  if(err){
                      console.log('NO SE PUDO ENVIAR A TRANSITO : ', err);
                      is_err = true;
                  }else{
                      console.log('SE ENVIO A TRANSITO : ', factura_);
                      is_err = false
                  }
              })
         }

        if(is_err === true){
            res.status(500).json({ message : 'ERROR AL ENVIAR A TRANSITO'});
        }else{
            res.status(200).json({ message : 'SE ENVIARON LAS FACTURAS A TRANSITO'});
        }
        
    } catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE TRANSITO : ', err);
        res.status(500).json({ message : 'ERROR AL ALCANZAR RUTA DE TRANSITO'});
    }
}

export let change_sincronizado_service = async ( req: Request, res: Response) => {
    try {
        const {factura} = req.body;
        const lista_facturas : factura[] = factura;
        const query = 'SELECT * FROM  change_state_to_sincronizado($1, $2);';
        let is_err;

        for (let i = 0; i < lista_facturas.length; i++) {
            const factura_ = lista_facturas[i].Factura;

            connDB.query(query, [factura_, ], (err, result)=>{
                if(err){
                    console.log('NO SE PUDO ENVIAR A TRANSITO : ', err);
                    is_err = true;
                }else{
                    console.log('SE ENVIO A TRANSITO : ', factura_);
                    is_err = false
                }
            })
        }

        if(is_err === true){
            res.status(500).json({ message : 'ERROR AL ENVIAR A TRANSITO'});
        }else{
            res.status(200).json({ message : 'SE ENVIARON LAS FACTURAS A TRANSITO'});
        }
        
    } catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE TRANSITO : ', err);
        res.status(500).json({ message : 'ERROR AL ALCANZAR RUTA DE TRANSITO'});
    }
}

// EN USO
export let get_cajas_one_fact = async ( req: Request, res: Response ) =>{
    try {
        const {factura} = req.query;
        const query = 'SELECT * FROM get_boxes_oneFact($1);'
        connDB.query(query, [factura], (err, result)=>{
            if(err){
                console.log('NO SE PUEDIERON OBTENER LAS CAJAS : ', err);
                res.status(500).json({ message : ' NO SE PUDO OBTENER LAs CAJAS'})
            }else{
                console.log('SE PUEDIERON OBTENER LAS CAJAS');
                res.status(200).json({ data : result.rows})
            }
        })
        
    } catch (err) {
        console.log('NO SE PUDO OBTENER LA RUTA DE CAJAS');
        res.status(500).json({ message : ' NO SE PUDO OBTENER LA RUTA DE CAJAS'})
    }
}

// en uso
export let get_facturas_en_transito =async ( req: Request, res: Response ) => {
    try {
        const query = 'SELECT * FROM get_transito_facturas();';
        connDB.query(query, (err, result)=>{
            if(err){
                console.log('ERROR AL OBTENER FACTURAS EN TRANSITO : ', err);
                res.status(500).json({message : 'no se pudo obtener las facturas en transito'});
            }else{
                console.log('SE OBTUBIERON LAS FACTURAS EN TRANSITO');
                res.status(200).json({ data : result.rows });
            }
        })
    } catch (err) {
        console.log('NO SE PUDO ALCANZAR LA RUTA DE OBTENER FACTURAS EN TRANSITO');
        res.status(500).json({ message : 'no se pudo obtener las facturas en transito'});
    }
}

// en uso
export let subir_fotos = async ( req: Request, res: Response ) => {
    try {
        const data = req.body;
        //console.log('fotos : ', data);
        const query = 'SELECT * FROM sincro_fact( $1, $2, $3, $4, $5);'; //fact text, foto text, firma text, detalle_ent text
        let error;

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const firma_ = await uploadFileToCloudinary(element.nameSing, 'bodega_despacho', element.factura);
            const foto_ = await uploadFileToCloudinary(element.namePic, 'bodega_despacho', element.factura + '_foto');
            //console.log('fotos subidas, firma: ', firma_, '   foto: ', foto_);
            
            if(firma_ != null && foto_ != null){
                connDB.query(query, [element.factura, foto_, firma_, 'N/A', element.fech_hora_entrega], (err, result) => {
                    if(err){
                        error = false;
                        console.log('ERROR AL CREAR FOTOS : ', err);
                    }else{
                        error = true;
                    }
                });
            }else{
                console.log('NO SE GENERARON LAS FOTOS');
                res.status(500).json({ message : 'NO SE PUDO GENERAR LAS FOTOS'});
            }
        }

        if(error == false){
            console.log('NO SE PUDO GENERAR LA SINCRONIZACION');
            res.status(500).json({ message : 'NO SE PUDO GENERAR LAS FOTOS'});
        }else{
            console.log('SE GENERARON LAS FOTOS Y SE SINCRONIZO');
            res.status(200).json({ message : 'SE GENERO LA SINCRONIZACION'});
        }
    } catch (err) {
        console.log('ERROR AL OBTENER RUTA DE SYNCRONIZACION : ', err);
        res.status(500).json({ message : 'NO SE PUEDE OBTENER RUTA DE SYNCRONIZACION DE FACTURAS' });
    }
}

export let getHistoFact_service =async ( req: Request, res: Response ) => {
    try {
        const query = 'SELECT * FROM get_summary_data();';
        connDB.query(query, (err, result)=>{
            if(err){
                console.log('ERROR AL OBTENER DATA : ', err);
                res.status(500).json({ message : 'NO SE PUDO OBTENER RUTA'});
            }else{
                console.log('SE OBTUBIERON LOS HISTORICOS');
                res.status(200).json({data : result.rows});
            }
        })
    } catch (err) {
        console.log('ERROR AL OBTENER RUTA: ', err);
        res.status(500).json({ message : 'NO SE PUDO OBTENER RUTA'});
    }
}
