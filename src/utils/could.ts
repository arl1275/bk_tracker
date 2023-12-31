import * as cloudinary from 'cloudinary';
import { ReadStream } from 'fs';
import fs from 'fs';
import { ReqFacturas } from '../interfaces/reqfacturas.interface';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.COULDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const FactSynchroHandler = ( data : ReqFacturas )=>{
  let base64Image: string;  // valor de la firma
  let base64Imag2: string;  // valor de foto
  let cloud = 'despacho_bodega';

  return new Promise((resolve, reject) => {
  if (typeof data.nameSing === 'string' && typeof data.namePic === 'string') {
    base64Image = data.nameSing; 
    base64Imag2 = data.namePic;
  } else if (data instanceof FormData) {
    const fileData = data.get('nameSing'); 
    const fileData2 = data.get('namePic');
    if (typeof fileData === 'string' && typeof fileData2 === 'string') {
      base64Image = fileData;
      base64Imag2 = fileData2;
    } else {
      reject('Image data not found in FormData');
      return;
    }
  } else {
    reject('Invalid image data type');
    return;
  }

  
   uploadFileToCloudinary(base64Image, cloud, data.ref_factura);
   if(base64Imag2){
    uploadFileToCloudinary(base64Imag2, cloud, data.ref_factura + 'pic');
   }else{
    base64Imag2 = 'SIN FOTO';
   }
   

});



}


export const uploadFileToCloudinary = (imagen : string , folder: string, nameFact: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    
    // if (typeof imageData.nameSing === 'string' && typeof imageData.namePic === 'string') {
    //   base64Image = imageData.nameSing; 
    //   basa64Imag2 = imageData.namePic;
    // } else if (imageData instanceof FormData) {
    //   const fileData = imageData.get('nameSing'); 
    //   const fileData2 = imageData.get('namePic');
    //   if (typeof fileData === 'string' && typeof fileData2 === 'string') {
    //     base64Image = fileData;
    //     basa64Imag2 = fileData2;
    //   } else {
    //     reject('Image data not found in FormData');
    //     return;
    //   }
    // } else {
    //   reject('Invalid image data type');
    //   return;
    // }

    const uploadOptions = {                     // this is to sing value
      public_id: nameFact,
      folder,
      overwrite: true,
      resource_type: 'image',
    };

    cloudinary.v2.uploader.upload(`data:image/png;base64,${imagen}`, uploadOptions as cloudinary.UploadApiOptions, (error, result) => {
      if (error) {
        console.log('ERROR AL ENVIAR FIRMA :', error);
        reject(error);
      } else {
        console.log('SE CREO FACTURA DE: ', uploadOptions.public_id);
        resolve(result);
      }
    });


  });
 // return [returNamePic, returNameSing];
};