import { FORCE_insert_process_of_synchro } from "./force_syncro_process";

export async function ForceSynchro( pedido : string, factura: string, albaran : string){
    try {
        await FORCE_insert_process_of_synchro(pedido, factura, albaran);
    } catch (err) {
        console.log('|| ERROR AL FORZAR SINCRONIZADO : ', err)
    }
    
}