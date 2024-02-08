"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToCloudinary = void 0;
const cloudinary = __importStar(require("cloudinary"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.COULDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadFileToCloudinary = (imagen, folder, nameFact) => {
    let base64Image = ''; // valor de la firma
    return new Promise((resolve, reject) => {
        if (typeof imagen === 'string') {
            base64Image = imagen;
        }
        else {
            reject('Invalid image data type');
            return;
        }
        const uploadOptions = {
            public_id: nameFact,
            folder,
            overwrite: true,
            resource_type: 'image',
        };
        cloudinary.v2.uploader.upload(`data:image/png;base64,${base64Image}`, uploadOptions, (error, result) => {
            if (error) {
                console.log('ERROR AL ENVIAR FIRMA :', error);
                reject(error);
            }
            else {
                console.log('SE CREO FACTURA DE: ', uploadOptions.public_id);
                const data = resolve(result === null || result === void 0 ? void 0 : result.secure_url);
                if (typeof (result === null || result === void 0 ? void 0 : result.secure_url) === 'string') {
                    //console.log('link the foto : ', data);
                    return data;
                }
                else {
                    return null;
                }
            }
        });
    });
};
exports.uploadFileToCloudinary = uploadFileToCloudinary;
