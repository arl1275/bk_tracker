import { Request, Response, query } from "express";
import connDB from "../utils/tracker_db";
import { usuario } from "../interfaces/usuario.interface";
import format from "pg-format";
import { EncryptPassword } from "../utils/utils";

export let get_all_entregadores_service = async (req : Request, res : Response) => {
    try{
        connDB.query('SELECT * FROM usuarios WHERE id_rol = 1;', (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).json({message :  'error al obtener entregadores'});
            } else {
              //console.log('Query result:', result.rows);
              res.status(200).json({ data: result.rows });
            }
          });
    }catch(err){
        console.error(`Ha ocurrido un error: ${err}`);
        res.status(500).json({message :  'error al obtener entregadores'});
    }
}

//-----------------------------------------------------------------//
//                      CRUD OF USERS                              //
//-----------------------------------------------------------------//

export let getAllUsuarios = async (req : Request, res : Response) => {
    try {
        const query = 'SELECT * FROM usuarios;';
        connDB.query(query, (err, result)=>{
            if(err){
                res.status(500).json({message :  'ERR AL OBTENER TODOS LOS USUARIOS'});
                console.log('el error es: ', err);
            }else{
                res.status(200).json({data : result.rows});
                console.log('SE ENVIO TODOS LOS USUARIOS');
            }
        })
    } catch (err) {
        res.status(500).json({message :  'ERR AL OBTENER TODOS LOS USUARIOS'});
    }
    
}

// this is to create users
export let CreateUserService = async (req : Request, res : Response) => {
    try {
        const {nombre, codEmpleado, rol, _Password , _QR} = req.body;
        let hassPas = await EncryptPassword(_Password);
        let val = 0;
            if(rol === 'ENTREGADOR'){
                val = 1;
            }else if(rol === 'GUARDIA'){
                val = 2;
            }else{
                val = 3;
            }
        const query = "INSERT INTO usuarios (nombre, cod_empleado, id_rol, _password, _qr) VALUES ($1, $2, $3, $4, $5)";
        let values = [nombre, codEmpleado, val, hassPas, _QR]
        connDB.query(query, values,(err, result)=>{
            if (err) {
                console.log('EROR AL CREAR :', err)
                res.status(500).json({message : 'NO SE CREO USUARIO EN DB'});
            } else {
                res.status(200).json({message : 'SE CREO EL USUARIO'})
            }
        });        
    } catch (err) {
        res.status(500).json({message : 'NO SE LLEGO A LA RUTA', err});
    }
}

export let DelUser =async (req : Request, res : Response) => {
    try {
        const {id} = req.body;
        const query = format('DELETE FROM usuarios WHERE id = %L', id);
        connDB.query(query, (err, result)=>{
            if (err) {
                res.status(500).json({message : 'ERR PARA ELIMINAR EL USUARIO', err});
            } else {
                res.status(200).json({message : 'SE ELIMINO EL USUARIO'});
            }
        })
    } catch (err) {
        res.status(500).json({message : 'ERR PARA ELIMINAR EL USUARIO', err});
    }
}

export let UpdateUserService = async ( req : Request, res : Response) => {
    try {
        const {id, nombre, cod_empleado, id_rol, _password , _qr} = req.body;
        const _hassPas = await EncryptPassword(_password)
        const query = "UPDATE usuarios SET nombre = $1, cod_empleado = $2, _password = $3, _qr = $4 WHERE id = $5";
        let values = [nombre, cod_empleado, _hassPas, _qr, id];
        connDB.query(query, values,(err, result)=>{
            if (err) {
                console.log('EROR AL CREAR :', err)
                res.status(500).json({message : 'NO SE CREO USUARIO EN DB'});
            } else {
                res.status(200).json({message : 'SE CREO EL USUARIO'})
            }
        });  
    } catch (err) {
        console.log('ERROR TO UPDATE USER');
        res.status(500).json({message : 'NO SE PUDO OBTENER RUTA PARA ACTUALIZAR USUARIO'})
    }
    
}

//-----------------------------------------------------------------//
//                      Check user sing                            //
//-----------------------------------------------------------------//


export let passUser_service = async (req: Request, res: Response) => {
    try {
      const { user, _Password } = req.query;
      console.log(user, _Password);
      const query = format('SELECT nombre, _password, id_rol FROM usuarios WHERE nombre = %L AND _password = %L', user, _Password);
      connDB.query(query, (err, result) => {
        if (err) {
          res.status(500).json({ message: 'ERROR AL REALIZAR LA CONSULTA' });
        } else {
          if (result.rows.length > 0) {
            if(result.rows[0].id_rol === 2){
                res.status(200).json({ message: 'Usuario válido' });
            }else{
                res.status(500).json({ message : 'NO ES UN ADMINISTRADOR'});
            }
            
          } else {
            res.status(401).json({ message: 'USUARIO INVALIDO' });
          }
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'NO SE PUDO OBTENER LA RUTA DE ACCESO' });
    }
  };
