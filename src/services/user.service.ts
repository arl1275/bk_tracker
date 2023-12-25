import { Request, Response, query } from "express";
import connDB from "../DBconnection/tracker_db";
import { usuario } from "../interfaces/usuario.interface";
import format from "pg-format";
import { resolveModuleName } from "typescript";

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

export let CreateUserService = async (req : Request, res : Response) => {
    try {
        const {nombre, codEmpleado, rol} = req.body;
        const newUser : usuario = {nombre: nombre, cod_empleado : codEmpleado, id_rol : rol};
        const query = format('INSERT INTO usuarios (nombre, cod_empleado, id_role) VALUES %L', newUser);
        connDB.query(query, (err, result)=>{
            if (err) {
                res.status(500).json({message : 'NO SE CREO USUARIO'});
            } else {
                res.status(200).json({message : 'SE CREO EL USUARIO'})
            }
        });        
    } catch (err) {
        res.status(500).json({message : 'NO SE CREO USUARIO', err});
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

//-----------------------------------------------------------------//
//                      Check user sing                            //
//-----------------------------------------------------------------//


// export let PassUser = async (req : Request, res : Response) => {
//     try{
//         cosnt query = format('SELECT * FROM user WHERE ')
//     }catch(err){
//         res.status(500).json({ message : 'NO SE PUDO OBTENER LA RUTA DE ACCESO'})
//     }
// }
