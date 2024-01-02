import { Response, Request } from "express";
import connDB from "../utils/tracker_db";
import { ReqFacturas} from "../interfaces/reqfacturas.interface";
import {uploadFileToCloudinary } from "../utils/could";


//--------------------------------------------------//
//                  GENERAL FUNCTIONS               //
//--------------------------------------------------//
export const get_all_entregas = async (req: Request, res: Response) => {
    try {
        //this has to be changed
        const query = 'SELECT * FROM entregas';
        connDB.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'error al obtener datos' });
            } else {
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'error al enviar peticion' });
    }
}

export const generate_void_entrega = async (req: Request, res: Response) => {
    const [ref_entrega, id_estado] = req.body;
    const query = 'INSERT INTO consolidados (ref_entrega, id_estado) values ($1, $2)';
    try {
        connDB.query(query, ["TEST", 1]);
    } catch (err) {
        console.log('ERROR AL GENERAR ENTREGA: ', err);
    }
}

export const get_entrega_by_id = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM entregas WHERE id = ($1)';
        const [id] = req.body;
        connDB.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'valor no existe' });
            } else {
                res.status(200).json({ data: result.rows });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'error' });
    }

}

//--------------------------------------------------//
//             CHANGE OF STATE FUNCTIONS            //
//--------------------------------------------------//

export const toCargandoService = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const query = "SELECT * FROM tocargando($1);";
        let num = parseInt(id);
        connDB.query(query, [num], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A CARGAR' });
            } else {
                console.log('FACTURA ENVIADA A CARGAR : ', num);
                res.status(200).json({ message: 'SE ENVIO A CARGAR' });
            }
        })

    } catch (err) {
        console.log("error :", err);
        res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A LA RUTA PARA CARGAR : ', err });
    }
}

export const toTransitoService = async (req: Request, res: Response) => {
    try {
        console.log('entro a service para enviar a transito');

        const values: number[] = req.body;
        console.log(values)

        if (!Array.isArray(values)) {
            throw new Error("IS NOT A ARRAY");
        }
        const query = "SELECT * FROM toTransito($1);";
        let errorOccurred = false
        for (let i = 0; i < values.length; i++) {
            console.log('entro al for del ingreso para cambio de estado');
            await new Promise<void>((resolve, reject) => {
                connDB.query(query, [values[i]], (err, result) => {
                    if (err) {
                        console.error('Error al ejecutar la consulta:', err);
                        errorOccurred = true;
                    }
                    resolve();
                });
            });
        }

        if (errorOccurred) {
            res.status(500).json({ message: 'NO SE ENVIARON LAS FACTURAS A TRANSITO' });
            console.log('SE GENERO UN ERROR AL OBTENER LA RUTA');
        } else {
            console.log('SE ENVIO LA FACTURA A TRANSITO');
            res.status(200).json({ message: 'SE ENVIARON LAS FACTURAS A TRANSITO' });
        }

    } catch (err) {
        console.log("error :", err);
        res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A LA RUTA PARA TRANSITO : ', err });
    }
}

export const toSincronizadoService = async (req: Request, res: Response) => {
    try {
        let valores: Array<ReqFacturas> = [];
        valores = await req.body;
        const query = "SELECT * FROM tosincronizado ($1, $2, $3, $4, $5);";
        let errorOccurred = false;
        console.log('upload data : ', valores);
        
        if (valores) {
            for (let i = 0; i < valores.length; i++) {
                // data to insert into DB
                let picName :string = 'N/A';
                let SingName : string = '';
                // data to insert into Cloudinary

                const { nameSing, namePic, fech_hora_entrega, id, ref_factura } = valores[i];


                if (typeof nameSing === 'string') {
                    SingName = await uploadFileToCloudinary(nameSing, 'despacho_bodega', ref_factura);
                    if(valores[0].namePic){
                        if(typeof namePic === 'string' && namePic != 'N/A'){
                            let headPic = ref_factura + 'PICNAME';
                            picName = await uploadFileToCloudinary(namePic, 'despacho_bodega', headPic )
                        }
                    }
                } else {
                    console.log('VALOR NO ES STRING', valores[0].nameSing);

                }
                console.log('fotos sing : ', SingName, ' fotos pic : ', picName);
                connDB.query(query, [id, fech_hora_entrega, picName, SingName, ref_factura], (err, result) => {
                    if (err) {
                        console.log('ERROR AL SINCRONIZAR : ', err);
                    } else {
                        console.log('fotos sing : ', SingName.length, ' fotos pic : ', picName.length)
                        console.log('FACTURA SE HA SINCRONIZADO');
                    }
                })
            }
        }

        if (errorOccurred) {
            res.status(500).json({ message: 'NO SE ENVIARON LAS FACTURAS A TRANSITO' });
            console.log('SE GENERO UN ERROR AL OBTENER LA RUTA');
        } else {
            console.log('SE SINCRONIZO LA FACTURA',);
            res.status(200).json({ message: 'SE SINCRONIZO LA FACTURA' });
        }

    } catch (err) {
        console.log("error :", err);
        res.status(500).json({ message: 'NO SE PUDO ENVIAR LA FACTURA A LA RUTA PARA SINCRONIZAR: ', err });
    }
}

//--------------------------------------------------//
//                IMAGE FUNCTIONS                   //
//--------------------------------------------------//

export const PicsToSend = async (req : Request, res : Response) => {
    try {
        const {id} = req.query;
        const query = 'SELECT * FROM getpicsofonefact($1)';
        
        if(id != undefined){
            connDB.query(query, [id], (err, result) => {
                if (err) {
                    console.log('ERROR AL ENVIAR FOTOS : ', err);
                    res.status(500).json({ message: 'valor no existe', err });
                } else {
                    console.log('SE ENVIARON FOTOS DE FACTURA : ', id)
                    res.status(200).json({ data: result.rows });
                }
            })
        }else{
            console.log('not a number');
        }
        
    } catch (err) {
        console.log('ERROR AL ACCEDER A RUTA : ', err)
        res.status(500).json({message : 'NO SE PUDO ACCEDER A LA RUTA'})
    }
}
