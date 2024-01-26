import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;
//--------------------------------------------------------------------//
//                    ENCRIPTACION DE CONTRASEÑAS                     //                
//--------------------------------------------------------------------//
export const EncryptPassword =async (_password: string) => {
    const hasshedPAs = await bcrypt.hash(_password, saltRounds);
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
