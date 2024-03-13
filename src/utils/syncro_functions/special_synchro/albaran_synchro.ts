import connDB from "../../db/localDB_config";
import { executeQuery } from "../../db/ax_config";
import { get_ids_pedidos_to_update, get_update_info_fromAX } from "./albaran_query";
import { obtenerFechaActual } from "../../handle_passwords/utils";

export const UpdateFacturasChanges = async () => {
    let dataAX : any = [];
    let dataLocal : any = [];
    let data_changes : any = [];

    dataAX = await executeQuery(get_update_info_fromAX()); // || pedidoventa | factura | albaran ||
    dataLocal = connDB.query(get_ids_pedidos_to_update()); // || p.id | p.pedidoventa | f.id | f.factura | a.id | a.albaran || 

    for (let i = 0; i < dataLocal.length; i++) {
        const localItem = dataLocal[i];
        for (let j = 0; j < dataAX.length; j++) {
            const axItem = dataAX[j];
            if (axItem.pedidoventa === localItem.pedidoventa && axItem.albaran === localItem.albaran) {
                data_changes.push(axItem);
                break; 
            }
        }
    }

    if(data_changes.length > 0){
        
    }else{
        console.log(`||--|| NO SE REALIZARON ACTUALIZACIONES DE FACTURAS : ${obtenerFechaActual()} ||--||`)
    }

}