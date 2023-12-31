import { Response, Request } from "express";
import connDB from "../utils/tracker_db";
import { ReqFacturas, SingFormat } from "../interfaces/reqfacturas.interface";
import { FactSynchroHandler} from "../utils/could";
import format from 'pg-format';

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
        let valores : Array<ReqFacturas> = [];
        valores = await req.body;
        const query = "SELECT * FROM tosincronizado ($1, $2, $3, $4, $5);";
        let errorOccurred = false;
        if(valores){
            //console.log('DATA IN BK : ',valores);
            for (let i = 0; i < valores.length; i++) {

                const brutoFecha = valores[i].fech_hora_entrega;
                const id_fact = valores[i].id;
                const dataImages = await  FactSynchroHandler(valores[i]);//uploadFileToCloudinary(valores[i], 'despacho_bodega', valores[i].ref_factura);
                console.log('data from create : ', dataImages);
                // const namePic = dataImages[1]; //await uploadImage(valores[i].namePic, valores[i].ref_factura);
                // const nameSing = dataImages[0]//await uploadImage (valores[i].nameSing);
                const nameId = 'yes';

                connDB.query(query, [id_fact, brutoFecha, dataImages[1].toString(), dataImages[0].toString(), nameId], (err, result) => {
                    if (err) {
                        console.log('ERROR AL SINCRONIZAR : ', err);
                    } else {
                        console.log('FACTURA SE HA SINCRONIZADO', dataImages);
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

