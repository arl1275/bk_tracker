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


export const uploadFileToCloudinary = (imagen : string , folder: string, nameFact: string): Promise<any> => {
  let base64Image: string = '';  // valor de la firma
  return new Promise((resolve, reject) => {
    
   if (typeof imagen === 'string') {
     base64Image = imagen;
   } else {
     reject('Invalid image data type');
     return;
   }

    const uploadOptions = {                     // this is to sing value
      public_id: nameFact,
      folder,
      overwrite: true,
      resource_type: 'image',
    };

    cloudinary.v2.uploader.upload(`data:image/png;base64,${base64Image}`, uploadOptions as cloudinary.UploadApiOptions, (error, result) => {
      if (error) {
        console.log('ERROR AL ENVIAR FIRMA :', error);
        reject(error);
      } else {
        console.log('SE CREO FACTURA DE: ', uploadOptions.public_id);
        const data = resolve(result?.secure_url);
        if(typeof result?.secure_url === 'string'){
          return data; 
        }else{
          return 'NO ES UN STRING';
        }
      }
    });


  });
 // return [returNamePic, returNameSing];
};