import { queryFact, queryAlbaran, queryBoxFact, insert_albaran, insert_boxes } from './main_query_provider';
import { factura, albaran_interface, caja_interface} from '../interfaces/Axproveider';
import { executeQuery } from './mssql.connection';
import { val_insert_facturas_nuevas, insert_factura } from './main_query_provider';
import * as dotenv from 'dotenv';
dotenv.config();



export const getDataFromTempTable = async () => {
  try {
    const data = await executeQuery(queryFact);
    
       if (data) {
         for (let i = 0; i < data.length; i++) {
           let factura: factura = data[i];

           if (factura.Factura === null || factura.Factura === '') {
             console.log('FACTURA CON VALORES INVALIDOS');
             continue;
           } else {
             if (await val_insert_facturas_nuevas(factura.Factura) === false) {
               let _id = await insert_factura(factura).catch((err) => {
                 console.error('Error inserting factura:', err);
               });
               if (typeof _id === 'number') {
                 const all_albaranes = await executeQuery(queryAlbaran(factura.Factura));      // obtengo todos los alvaranes de la factura ingresada
        
                 if(all_albaranes){
                   for(let j = 0; j < all_albaranes.length; j++){
                     let data_albaran: albaran_interface;
                     data_albaran = all_albaranes[j];
                     let result_albaran_insert = await insert_albaran(data_albaran, _id);
            
                     if(result_albaran_insert){
                       let all_cajas = await executeQuery(queryBoxFact(data_albaran.Albaran));
                       if(all_cajas){
                         for (let k = 0; k < all_cajas.length; k++) {
                         let caja_ : caja_interface;
                         caja_ = all_cajas[k];
                         if(caja_){
                           await insert_boxes(caja_, result_albaran_insert);
                         }
                         }
                       }else{
                         console.log('NO SE OBTUBIERON LAS CAJAS');
                       }
                     }else{
                       console.log('NO SE RECBIO ID_ALBARAN');
                     }

                   }
                 }else{
                   console.log('NO SE OBTUBO LISTA DE ALBARANES');
                 }

               } else {
                 console.log('Failed to insert factura');
                 return;
               }
             }

           }
         }
       }

  } catch (err) {

  }

};


