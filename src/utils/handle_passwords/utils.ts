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
//                            DATE GENERATORS                         //                
//--------------------------------------------------------------------//

function agregarCeroALaIzquierda(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }
  
export function obtenerFechaActual(): string {                      // this function is to get the today date, to sync funtions
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = agregarCeroALaIzquierda(fechaActual.getMonth() + 1);
    const dia = agregarCeroALaIzquierda(fechaActual.getDate());

    return `${año}-${mes}-${dia}`;
}

export function obtenerFechaConAtraso( props : number) {
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() - props); // Restar 3 días

    const año = fechaActual.getFullYear();
    const mes = agregarCeroALaIzquierda(fechaActual.getMonth() + 1);
    const dia = agregarCeroALaIzquierda(fechaActual.getDate());

    return `${año}-${mes}-${dia}`;
}

