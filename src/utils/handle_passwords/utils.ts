import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;
//--------------------------------------------------------------------//
//                    ENCRIPTACION DE CONTRASEÑAS                     //                
//--------------------------------------------------------------------//
export const EncryptPassword_ =  (_password: string) => {
    //console.log('constraseña : ', _password, ' tipo :', typeof _password);
    const hasshedPAs =  bcrypt.hash(_password, 10);
    console.log('SE MODIFICO CONTRASEÑA DE USUARIO');
    return hasshedPAs;
}


export const ComparedPassWord = async (LogPassword : string, DBPassword : string) => {
    try {
        const match = await bcrypt.compare(LogPassword, DBPassword);
    return match;
    } catch (err) {
      return false;   
    }
}

//--------------------------------------------------------------------//
//                               PIC HANDLERS                         //                
//--------------------------------------------------------------------//
