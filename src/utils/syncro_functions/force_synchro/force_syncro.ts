import { FORCE_insert_process_of_synchro } from "./force_syncro_process";

export async function ForceSynchro( caja : string, tipo : number){
    try {
        let result : any = await FORCE_insert_process_of_synchro(caja, tipo);
        return result
    } catch (err) {
        console.log('|| ERROR AL FORZAR SINCRONIZADO : ', err);
        return [false, { message : 'Ocurrio un error al sincronizar'}];
    }
    
}