import connDB from "../../db/localDB_config";
import { executeQuery } from "../../db/ax_config";
import { get_ids_pedidos_to_update, get_update_info_fromAX } from "./albaran_query";
import { obtenerFechaActual } from "../../handle_passwords/utils";
import { UpdateFacturaLater } from "./update_functions";

export const UpdateFacturasChanges = async () => {
    try {
        let dataAX: any = [];
        let dataLocal: any = [];
        let data_changes: any = [];

        // this function brings all the facturas from AX that applies into the terns of the syncron, whit the next format
        // || pedidoventa | factura | albaran ||
        dataAX = await executeQuery(get_update_info_fromAX());

        // this funciton will bring the facturas from our local DB that are into our 
        dataLocal = connDB.query(get_ids_pedidos_to_update()); // || pedido_id | p.pedidoventa | factura_id | f.factura | albaran_id | a.albaran || 

        for (let i = 0; i < dataLocal.length; i++) {
            const localItem = dataLocal[i];

            for (let j = 0; j < dataAX.length; j++) {
                const axItem = dataAX[j];

                if (axItem.pedidoventa === localItem.pedidoventa && axItem.albaran === localItem.albaran && localItem.factura !== axItem.factura) {
                    data_changes.push(
                        {
                            id_pedi: localItem.pedido_id,
                            pedidoventas: localItem.pedidoventa,
                            id_fact: localItem.factura_id,
                            factura: axItem.factura,
                            albara_: localItem.albaran,
                            id_alba: localItem.albaran_id
                        }
                    );
                    break;
                }

            }
        }

        if (data_changes.length > 0) {
            await UpdateFacturaLater(data_changes);
        } else {
            console.log(`
        ||----------------------------------------------------------------------------------------------------||
        ||                NO SE REALIZARON ACTUALIZACIONES DE FACTURAS : ${obtenerFechaActual()}              ||
        ||----------------------------------------------------------------------------------------------------||
        `)
        }
    } catch (err) {
        console.log(`
        ||----------------------------------------------------------------------------------------------------||
        ||                             ERROR AL ACTUALIZAR DATOS DE LAS FACTURAS                              ||
        ||----------------------------------------------------------------------------------------------------||
        `)
    }


}