import { FORCE_insert_process_of_synchro } from "./force_syncro_process";

export async function ForceSynchro( factura : string){
    try {
        let result : any = await FORCE_insert_process_of_synchro(factura);
        return result
    } catch (err) {
        console.log('|| ERROR AL EJECUTAR FUNCION DE SINCRONIZADO ', err);
        return [false, { message : 'Ocurrio un error al sincronizar'}];
    }
    
}