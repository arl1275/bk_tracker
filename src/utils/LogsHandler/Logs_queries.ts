import { AllDetails } from "../../interfaces/db_interfeces/factura.interface";
import connDB from "../db/localDB_config";
//this is to get the preload of one register
export const GetPRELOADRegister = async( id : number) =>{
    try {
        const query = `SELECT * FROM logs WHERE id = '${id}'`;
        const result : any = await connDB.query(query);
        return result ? result :  [false, { message : 'NO EXISTE ESE VALOR EN LOGS'}]
    } catch (err) {
        console.log('|| hubo un error al cargar precargado :: ', err)
        return [false , { message : 'ERROR al obtener el precargado de log'}]
    }
}

// This is to create a LOG
export const createLog = ( detalleCreacion : string ) =>{
    return `INSERT INTO logs (create_at, detalle_creacion) values (CURRENT_TIMESTAMP AT TIME ZONE 'UTC-6', ${detalleCreacion});`
};

//this is to update the log of one register
export const UpdateLogs = ( IdToUpdate : number, details : AllDetails) => {
    return `
    UPDATE logs 
    SET detalle_declaracion_envio = ${details.detalle_declaracion_envio} , 
    detalle_transito = ${details.detalle_transito},
    detalle_entrega = ${details.detalle_entrega},
    detalle_sincronizado = ${details.detalle_sincronizado},
    detalle_de_pospuesto = ${details.detalle_pospuesto},
    detalle_cancelacion = ${details.detalle_cancelacion}
    WHERE id = ${IdToUpdate}
    `;
}

