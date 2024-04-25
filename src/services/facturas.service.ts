import { Request, Response, query } from "express";
import connDB from "../utils/db/localDB_config";
import format from "pg-format";
import { caja, factura, pedidoventa } from "../interfaces/db_interfeces/Axproveider";
import { uploadFileToCloudinary } from "../utils/db/cloudinary_config";
import { QueryResult } from "pg";
import { sendEmail_transito } from "../utils/reports/mail_body_transit";
import { sendEmail_Entregados } from "../utils/reports/mail.body_syncro";
import { ForceSynchro } from "../utils/syncro_functions/force_synchro/force_syncro";


//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------

// EN USO
export let get_all_facturas_service = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM resumen_facturas_para_despacho()'
        connDB.query(query, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
            } else {
                res.status(200).json({ data: result.rows });
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

export let change_preparacion_service = async (req: Request, res: Response) => {
    try {
        const { factura } = req.body;
        const lista_facturas: factura[] = factura;
        const query = 'SELECT * FROM change_state_to_enpreparacion($1);';
        let is_err;

        for (let i = 0; i < lista_facturas.length; i++) {
            const factura_ = lista_facturas[i].Factura;
            connDB.query(query, [factura_], (err, result) => {
                if (err) {
                    console.log('NO SE PUDO ENVIAR A PREPARACION : ', err);
                    is_err = true;
                } else {
                    console.log('SE ENVIO A PREPARACION : ', factura_);
                    is_err = false
                }
            })
        }

        if (is_err === true) {
            res.status(500).json({ message: 'ERROR AL ENVIAR A PREPARACION' });
        } else {
            res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A PREPARACION' });
        }

    } catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE A PREPARACION : ', err);
        res.status(500).json({ message: 'ERROR AL ALCANZAR RUTA DE A PREPARACION' });
    }
}

//EN USO
// export let change_transito_service = async ( req: Request, res: Response ) => {
//     try {
//         let data_to_mail : string[] = [];                                   // this is to save the facturas references, to generate an Email.
//         const data = req.body;
//         console.log('DATA DESDE LA APP :::' , data);
//         const query = 'SELECT * FROM change_state_to_entransito($1);'; // the $1, is the referencence of the factura
//         let is_err;

//          for (let i = 0; i < data.length; i++) {
//              const factura_ = data[i];
//             let result = await connDB.query(query, [factura_], (err, result)=>{
//                   if(err){
//                       console.log('NO SE PUDO ENVIAR A TRANSITO : ', err);
//                       is_err = true;
//                   }else{
//                       console.log('SE ENVIO A TRANSITO : ', factura_);
//                       data_to_mail.push(factura_);
//                       is_err = false
//                   }
//               })
//          }

//         if(is_err === true){
//             res.status(500).json({ message : 'ERROR AL ENVIAR A TRANSITO'});
//         }else{
//             console.log('DESDE LA RUTA :::', data_to_mail);
//             await sendEmail_transito(data_to_mail);
//             res.status(200).json({ message : 'SE ENVIARON LAS FACTURAS A TRANSITO'});
//         }

//     } catch (err) {
//         console.log('ERROR AL ALCANZAR RUTA DE TRANSITO : ', err);
//         res.status(500).json({ message : 'ERROR AL ALCANZAR RUTA DE TRANSITO'});
//     }
// }

export let change_transito_service = async (req: Request, res: Response) => {
    try {
        let data_to_mail: number[] = []; // Array para guardar las referencias de las facturas
        const data = req.body;
        
        const query = 'SELECT * FROM change_state_to_entransito($1);'; // La variable $1 es la referencia de la factura

        if(data.length > 0){
            for (let i = 0; data.length > i; i++) {
                const factura_ = parseInt(data[i]);
                try {
                    console.log('SE ENVIO A TRANSITO:', factura_);
                    await connDB.query(query, [factura_]);
                    console.log('tipo de id ::: ', typeof factura_);
                    data_to_mail.push(factura_);
                    
                } catch (err) {
                    console.log('NO SE PUDO ENVIAR A TRANSITO:', err);
                    res.status(500).json({ message: 'ERROR AL ENVIAR A TRANSITO' });
                    return; // Termina la ejecución de la función si hay un error
                }
            }
        }else{
            res.status(500).json({ message: 'ERROR AL ENVIAR A TRANSITO PORQUE NO LLEGO LA DATA PARA EMAIL' });
            return;
        }
        

        console.log('DESDE LA RUTA:', data_to_mail);
        await sendEmail_transito(data_to_mail);
        res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A TRANSITO' });
    } catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE TRANSITO:', err);
        res.status(500).json({ message: 'ERROR AL ALCANZAR RUTA DE TRANSITO' });
    }
}


export let change_sincronizado_service = async (req: Request, res: Response) => {
    try {
        const { factura } = req.body;
        const lista_facturas: factura[] = factura;
        const query = 'SELECT * FROM  change_state_to_sincronizado($1, $2);';
        let is_err;

        for (let i = 0; i < lista_facturas.length; i++) {
            const factura_ = lista_facturas[i].Factura;

            connDB.query(query, [factura_,], (err, result) => {
                if (err) {
                    console.log('NO SE PUDO ENVIAR A TRANSITO : ', err);
                    is_err = true;
                } else {
                    console.log('SE ENVIO A TRANSITO : ', factura_);
                    is_err = false
                }
            })
        }

        if (is_err === true) {
            res.status(500).json({ message: 'ERROR AL ENVIAR A TRANSITO' });
        } else {
            res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A TRANSITO' });
        }

    } catch (err) {
        console.log('ERROR AL ALCANZAR RUTA DE TRANSITO : ', err);
        res.status(500).json({ message: 'ERROR AL ALCANZAR RUTA DE TRANSITO' });
    }
}

// EN USO
export let get_cajas_one_fact = async (req: Request, res: Response) => {
    try {
        const { factura } = req.query;
        const query = 'SELECT * FROM get_boxes_oneFact($1);'
        connDB.query(query, [factura], (err, result) => {
            if (err) {
                console.log('NO SE PUEDIERON OBTENER LAS CAJAS : ', err);
                res.status(500).json({ message: ' NO SE PUDO OBTENER LAs CAJAS' })
            } else {
                console.log('SE PUEDIERON OBTENER LAS CAJAS');
                res.status(200).json({ data: result.rows })
            }
        })

    } catch (err) {
        console.log('NO SE PUDO OBTENER LA RUTA DE CAJAS');
        res.status(500).json({ message: ' NO SE PUDO OBTENER LA RUTA DE CAJAS' })
    }
}

// en uso
export let get_facturas_en_transito = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        console.log('data de get facturas : ', req.query);
        const query = 'SELECT * FROM get_transito_facturas($1);';
        connDB.query(query, [id], (err, result) => {
            if (err) {
                console.log('ERROR AL OBTENER FACTURAS EN TRANSITO : ', err);
                res.status(500).json({ message: 'no se pudo obtener las facturas en transito' });
            } else {
                console.log('SE OBTUBIERON LAS FACTURAS EN TRANSITO DE : ', id);
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (err) {
        console.log('NO SE PUDO ALCANZAR LA RUTA DE OBTENER FACTURAS EN TRANSITO');
        res.status(500).json({ message: 'no se pudo obtener las facturas en transito' });
    }
}

export let subir_fotos = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const query = 'SELECT * FROM sincro_fact($1, $2, $3, $4, $5);';
        let fact_list_to_mail: number[] = []; // Array para guardar las facturas para enviar un correo electrónico

        for (let i = 0; i < data.length; i++) {
            const element = data[i];

            const firma_ = await uploadFileToCloudinary(element.nameSing, 'bodega_despacho', element.factura);
            const foto_ = await uploadFileToCloudinary(element.namePic, 'bodega_despacho', element.factura + '_foto');

            if (firma_ != null && foto_ != null) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        connDB.query(query, [element.factura_id, foto_, firma_, 'N/A', element.fech_hora_entrega], (err, result) => {
                            if (err) {
                                console.log('ERROR AL CREAR FOTOS:', err);
                                reject(err);
                            } else {
                                fact_list_to_mail.push(parseInt(element.factura_id));
                                resolve();
                            }
                        });
                    });
                } catch (error) {
                    throw error;
                }
            } else {
                console.log('NO SE GENERARON LAS FOTOS');
                res.status(500).json({ message: 'NO SE PUDO GENERAR LAS FOTOS' });
                return;
            }
        }

        console.log('data to send file:', fact_list_to_mail);
        console.log('SE GENERARON LAS FOTOS Y SE SINCRONIZARON');
        await sendEmail_Entregados(fact_list_to_mail);
        res.status(200).json({ message: 'SE GENERO LA SINCRONIZACION' });
    } catch (err) {
        console.log('ERROR AL OBTENER RUTA DE SYNCRONIZACION:', err);
        res.status(500).json({ message: 'NO SE PUEDE OBTENER RUTA DE SYNCRONIZACION DE FACTURAS' });
    }
}


// en uso
export let getHistoFact_service = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM get_summary_data();';
        connDB.query(query, (err, result) => {
            if (err) {
                console.log('ERROR AL OBTENER DATA : ', err);
                res.status(500).json({ message: 'NO SE PUDO OBTENER RUTA' });
            } else {
                console.log('SE OBTUBIERON LOS HISTORICOS');
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (err) {
        console.log('ERROR AL OBTENER RUTA: ', err);
        res.status(500).json({ message: 'NO SE PUDO OBTENER RUTA' });
    }
}

// en uso
export let getCajasOneFact_service = async (req: Request, res: Response) => {
    try {
        interface CajaProps {
            id_fact: number;
            fact: string;
            albaran: string;
            caja: string;
            cantidad: number;
        }

        const { data } = req.query;
        let error = false;
        let cajas_arr: CajaProps[] = [];
        const query = 'SELECT * FROM get_cajas_of_fact($1, $2);';

        if (Array.isArray(data)) {
            await Promise.all(
                data.map(async (element: any) => {
                    let id_ = parseInt(element.id_fact);
                    let factura: string = '';

                    if (typeof element.fact === 'string') factura = element.fact;

                    try {
                        const result = await new Promise<QueryResult<CajaProps>>((resolve, reject) => {
                            connDB.query(query, [id_, factura], (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });

                        cajas_arr.push(...result.rows);
                    } catch (err) {
                        error = true;
                    }
                })
            );
        }

        if (error === false && cajas_arr.length > 0) {
            //console.log('data a mandar : ', cajas_arr);
            console.log('SE OBTUVIERON LAS CAJAS');
            res.status(200).json({ data: cajas_arr });
        } else {
            res.status(500).json({ message: 'Error obtaining cajas' });
            console.log('Failed to obtain cajas');
        }
    } catch (err) {
        console.error('Error in getCajasOneFact_service:', err);
        res.status(500).json({ message: 'Failed to obtain cajas' });
    }
};

// en uso
export let getAdminFacts_service = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM get_invoice_info();';
        connDB.query(query, (err, result) => {
            if (err) {
                console.log('ERROR AL OBTENER DATA :', err);
                res.status(500).json({ message: 'ERROR AL OBTENER DATA' });
            } else {
                console.log('SE OBTUBIERON LAS FACTURAS ADMIN');
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (err) {
        console.log('ERRO AL OBTENER LA RUTA :', err);
        res.status(500).json({ message: 'ERROR AL OBTENER RUTA' });
    }
}

// en uso

export let change_state_to_null = async (req: Request, res: Response) => {
    try {
        const { factura } = req.query;
        let val = ''
        if (typeof factura === 'string') val = factura

        const query = 'SELECT * FROM change_state_to_null_state($1);';

        connDB.query(query, [val], (err, result) => {
            if (err) {
                console.log('ERROR NO SE PUDO HACER CAMBIO DE FACTURA', err);
                res.status(500).json({ message: 'NO SE PUDO HACER EL CAMBIO DE LA FACTURA' });
            } else {
                console.log('SE REALIZO EL CAMBIO DE FACTURA');
                res.status(200).json({ message: 'SE REALIZO EL CAMBIO DE LA FACTURA A NULL' })
            }
        })


    } catch (err) {
        console.log('ERROR NO SE PUDO HACER CAMBIO DE FACTURA', err);
        res.status(500).json({ message: 'NO SE PUDO HACER EL CAMBIO DE LA FACTURA' });
    }
}

//---------------------------- THIS IS AN ADMIN FUNCTION SERVICE ------------------------------------//

export let forceFactura_service = async (req: Request, res: Response) => {
    try {
        const { caja, tipo } = req.query;
        console.log('resultado ', caja, tipo);
        if(typeof caja === 'string' && typeof tipo === 'string' ){
            const tipo_ : number = parseInt(tipo);
            const result = await ForceSynchro(caja, tipo_);
            
            if (Array.isArray(result) && result.length === 2) {
                const [success, data] = result;

                if (success === true) {
                    res.status(200).json({ message: data.message });
                } else {
                    res.status(500).json({ message: data.message });
                }
            } else {
                res.status(500).json({ message: 'Respuesta inesperada de ForceSynchro' });
            }
            
        }else{
            res.status(500).json({ message : 'NO SE EJECUTO LAS FUNCIONES'});
        }
        
    } catch (err) {
        console.log(' ERROR AL FORZAR SINCRONIZACION :', err);
        res.status(500).json({ message: ' NO SE PUDO SINCRONIZAR LA FACTURA MANUALMENTE' });
    }
}