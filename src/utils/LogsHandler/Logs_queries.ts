import { AllDetails } from "../../interfaces/db_interfeces/factura.interface";
import connDB from "../db/localDB_config";
//this is to get the preload of one register
export const GetPRELOADRegister = async (id: number) => {
    try {
        const query = `SELECT * FROM logs WHERE id = '${id}'`;
        const result = await connDB.query(query);
        return result ? result.rows[0] : [false, { message: 'NO EXISTE ESE VALOR EN LOGS' }]
    } catch (err) {
        console.log('|| hubo un error al cargar precargado :: ', err)
        return [false, { message: 'ERROR al obtener el precargado de log' }]
    }
}

// This is to create a LOG
export const createLog = () => {
    return `INSERT INTO logs (created_at, detalle_creacion) values (CURRENT_TIMESTAMP AT TIME ZONE 'UTC-6', $1) RETURNING id;`
};

const UpdateDecClaracionEnvio = 'UPDATE logs SET detalle_declaracion_envio = $1 WHERE id = $2;';
const UpdateDetalleTransito = 'UPDATE logs SET detalle_transito = $1 WHERE id = $2;';
const UpdateDetalleEntrega = 'UPDATE logs SET detalle_entrega = $1 WHERE id = $2;';
const UpdateDetalleSincronizado = 'UPDATE logs SET detalle_sincronizado = $1 WHERE id = $2;';
const UpdateDetallePospuesto = 'UPDATE logs SET detalle_pospuesto = $1 WHERE id = $2;';
const UpdateDetalleCancelacion = 'UPDATE logs SET detalle_cancelacion = $1 WHERE id = $2;';

//this is to update the log of one register
export const UpdateLogs = () => {
    return `
    UPDATE logs 
    SET detalle_declaracion_envio = $2,
    detalle_transito = $3,
    detalle_entrega = $4,
    detalle_sincronizado = $4,
    detalle_de_pospuesto = $5,
    detalle_cancelacion = $6,
    WHERE id = $1;
    `;
}


// THIS IS TO CREATE A LOG REGISTER, AND RETURN THE ID OR 0
// this is not exactly a query, but i didn't know, where should i wrote it out.
// this funtion works to forceSynchro and normalSynchro.
export const CrearLog_returning_id = async (factura: string, Forzado: boolean) => {
    let idLog: number = 0;
    //console.log(' PARA forzar :: ',factura, Forzado )
    if (factura.startsWith('AL-')) {
        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19); // Formato: YYYY-MM-DD HH:MM:SS
        const query = createLog();
        const detalle: string = `${formattedDate} : ${Forzado ? `ALBARAN : ${factura}, Creado e insertado FORZADO` : 'ALBARAN, Creado e insertado NORMAL'}`
        try {
            const res = await connDB.query(query, [detalle]);
            console.log('Valor obtenido :: ', res.rows[0].id, typeof res.rows[0].id)
            idLog = typeof res.rows[0].id === 'number' ? res.rows[0].id : 0;
        } catch (err) {
            console.error('Error executing query', err);
        }
    } else {
        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19); // Formato: YYYY-MM-DD HH:MM:SS
        const query = createLog();
        const detalle: string = `${formattedDate} : ${Forzado ? 'FACTURA, Creada e insertada FORZADO' : 'FACTURA, Creado e insertado NORMAL'}`
        try {
            const res = await connDB.query(query, [detalle]);
            idLog = typeof res.rows[0].id === 'number' ? res.rows[0].id : 0;
        } catch (err) {
            console.error('Error executing query', err);

        }

    }

    return idLog;
}


const Type_ = (selecction: string) => {
    if (selecction.startsWith('Detalle declaracion')) {
        return UpdateDecClaracionEnvio;
    } else if (selecction.startsWith('Detalle transito')) {
        return UpdateDetalleTransito;
    } else if (selecction.startsWith('Detalle entrega')) {
        return UpdateDetalleEntrega;
    } else if (selecction.startsWith('Detalle sincronizado')) {
        return UpdateDetalleSincronizado;
    } else if (selecction.startsWith('Detalle pospuesto')) {
        return UpdateDetallePospuesto;
    } else if (selecction.startsWith('Detalle cancelacion')) {
        return UpdateDetalleCancelacion;
    }
}

//  THIS FUNTION IS TO SELECT AND UPDATE AN ESPECIFIC FIELD IN LOGS TABLE
export const UPLOADER_LOG = async (id_factura : number, message: string) => {
    try {
        let IdLog :  number = 0;
        let ValorIdLog = await connDB.query('SELECT id_logs FROM facturas WHERE id = $1', [id_factura]);
        IdLog = typeof ValorIdLog.rows[0].id_logs === 'number' ? ValorIdLog.rows[0].id_logs : 0

        const query : string | undefined = Type_(message);

        if(typeof query === 'string' && IdLog > 0 ){
            const result = await connDB.query(query, [message, IdLog])
        }else{
            console.log('|| ESTE VALOR NO ES VALIDO PARA CONSOLIDADO DE LOGS :: ', typeof query === 'string' , IdLog )
        }
       
    } catch (err) {
        console.log('||     Error al consolidar detalles : ', err);
    }
}