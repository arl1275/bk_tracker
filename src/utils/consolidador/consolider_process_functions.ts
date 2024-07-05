import { executeQuery } from "../db/ax_config";
import { GetFacturasConsolidadas } from "./consolider_queries_AX";
import { obtenerFechaActual, obtenerFechaConAtraso } from "../handle_passwords/utils";

export const Consolidador = ( values : any ) =>{
    //THIS FUNCTION IS TO IDENTIFY CONSOLIDATIONS OF REGISTERS.
}

export const UnConsolidate = ( values : any) =>{
    // THIS FUNCION IS TO REVERB CONSOLIDATINS PREVIUSLY MAKED

}

export const PreLoadConsolidation = async ( factura : null | string ) =>{
    try {
        if(factura != null && factura.length > 0){

        }else{
            console.log('|| Error al cargar el precargado...');
            return [ false, { message : 'Error al generar el precargado' } ];
        }
    } catch (err) {
        console.log('|| Error al generar precargado de consolidados');
        return [ false, { message : 'Error al generar el precargado' } ];
    }
    
}