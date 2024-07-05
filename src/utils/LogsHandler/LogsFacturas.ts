import { AllDetails } from "../../interfaces/db_interfeces/factura.interface";
import { GetPRELOADRegister } from "./Logs_queries";

export const UpdateFacturasLog = async ( id_ :  number, details : AllDetails) => {
    try {
        const result = await GetPRELOADRegister(id_);
        if(!result){
            return [false, { message : 'NO exite ese registro' }];
        }else if(typeof result[0] != 'boolean'){
            let NewValues : AllDetails;
            result.array.forEach((item : any) => {
                
            });

        }
    } catch (err) {
        console.log('|| ERROR al actualizar log :: ', err);
        return [false, { message : 'ERROR al actualizar LOG'}]
    }
}