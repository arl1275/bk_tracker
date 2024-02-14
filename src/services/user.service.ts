import { Request, Response, query } from "express";
import connDB from "../utils/db/localDB_config";
import { usuario } from "../interfaces/ft_interfaces/usuario.interface";
import format from "pg-format";
import { EncryptPassword_, ComparedPassWord } from "../utils/handle_passwords/utils";

export let get_all_entregadores_service = async (req: Request, res: Response) => {
  try {
    connDB.query('SELECT id, nombre FROM users WHERE id_role = 3;', (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'error al obtener entregadores' });
      } else {
        //console.log('Query result:', result.rows);
        res.status(200).json({ data: result.rows });
      }
    });
  } catch (err) {
    console.error(`Ha ocurrido un error: ${err}`);
    res.status(500).json({ message: 'error al obtener entregadores' });
  }
}

//-----------------------------------------------------------------//
//                      CRUD OF USERS                              //
//-----------------------------------------------------------------//

export let getAllUsuarios = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM users;';
    connDB.query(query, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'ERR AL OBTENER TODOS LOS USUARIOS' });
        console.log('el error es: ', err);
      } else {
        res.status(200).json({ data: result.rows });
        console.log('SE ENVIO TODOS LOS USUARIOS');
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'ERR AL OBTENER TODOS LOS USUARIOS' });
  }

}

// this is to create users
export let CreateUserService = async (req: Request, res: Response) => {
  try {
    const { nombre, codEmpleado, rol, _Password, _QR } = req.body;
    let hassPas = await EncryptPassword_(_Password);

    let val = 0;

    // THIS IS TO SELECT THE ROLE OF THE NEW USER
    if (rol === '1') {
      val = 1;
    } else if (rol === '2') {
      val = 2;
    } else if (rol === '3'){
      val = 3;
    }else if (rol === '4'){
      val = 4;
    }

    const query = "INSERT INTO users (nombre, cod_empleado, id_role, hashed_password, qr) VALUES ($1, $2, $3, $4, $5);";
    let values = [nombre, codEmpleado, val, hassPas, _QR]
    connDB.query(query, values, (err, result) => {
      if (err) {
        console.log('EROR AL CREAR :', err)
        res.status(500).json({ message: 'NO SE CREO USUARIO EN DB' });
      } else {
        res.status(200).json({ message: 'SE CREO EL USUARIO' })
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'NO SE LLEGO A LA RUTA', err });
  }
}

export let DelUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const query = format('DELETE FROM usuarios WHERE id = %L', id);
    connDB.query(query, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'ERR PARA ELIMINAR EL USUARIO', err });
      } else {
        res.status(200).json({ message: 'SE ELIMINO EL USUARIO' });
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'ERR PARA ELIMINAR EL USUARIO', err });
  }
}

export let UpdateUserService = async (req: Request, res: Response) => {
  try {
    const { id, nombre, cod_empleado, id_rol, _password, _qr } = req.body;
    //console.log('nueva contraseña : ', _password, ' tipo : ', typeof _password);
    const _hassPas = await EncryptPassword_(`${_password}`);
    
    const query = "UPDATE users SET nombre = $1, cod_empleado = $2, hashed_password = $3, qr = $4 WHERE id = $5";
    let values = [nombre, cod_empleado, _hassPas, _qr, id];
    connDB.query(query, values, (err) => {
      if (err) {
        console.log('EROR AL MODIFICAR :', err)
        res.status(500).json({ message: 'NO SE CREO USUARIO EN DB' });
      } else {
        res.status(200).json({ message: 'SE CREO EL USUARIO' })
      }
    });
  } catch (err) {
    console.log('ERROR TO UPDATE USER', err);
    res.status(500).json({ message: 'NO SE PUDO OBTENER RUTA PARA ACTUALIZAR USUARIO' })
  }

}

//-----------------------------------------------------------------//
//                      Check user sing                            //
//-----------------------------------------------------------------//


export let passUser_service = async (req: Request, res: Response) => {
  try {
    const { user, _password } = req.query;
    console.log(user, _password);
    const query = 'SELECT nombre, hashed_password, id_role, cod_empleado FROM users WHERE nombre = $1';

    connDB.query(query,[user], async (err, result) => {

      if (err) {
        console.log('ERROR AL ENVIAR A VALIDAR USUARIO : ', err);
        res.status(500).json({ message: 'ERROR AL REALIZAR LA CONSULTA' });
      } else {

        if (result.rows.length > 0) {
          if (result.rows[0].id_role === 1 || result.rows[0].id_role ===  4) {

            if(typeof _password === 'string'){

              const valid = await ComparedPassWord(_password, result.rows[0].hashed_password);

              if(valid){
                const usurario = {
                  nombre : result.rows[0].nombre,
                  cod_empleado : result.rows[0].cod_empleado,
                  type_ : result.rows[0].id_role
                }
                console.log('SE INGRESO VIA FRONT-END KELLER-CHECK');
                res.status(200).json({ data : usurario});
              }else{
                res.status
              }

            }else{
              console.log('LA CONTRASEÑA NO ES UN STRING');
              res.status(500).json({message : 'la contraseña no es un string'});
            }
                        
          
          } else {
            res.status(500).json({ message: 'NO ES UN ADMINISTRADOR' });
          }

        } else {
          res.status(401).json({ message: 'USUARIO INVALIDO' });
        }
        
      }
    });

  }catch(err) {
    res.status(500).json({ message: 'NO SE PUDO OBTENER LA RUTA DE ACCESO' });
  }

};

export let passUser_appService = async (req: Request, res: Response) => {
  try {
    const { user, _password } = req.query;
  console.log(user, _password);
  const query = 'SELECT id, qr, nombre, hashed_password, id_role, cod_empleado FROM users WHERE nombre = $1';

  connDB.query(query,[user], async (err, result) => {

    if (err) {
      console.log('ERROR AL ENVIAR A VALIDAR USUARIO : ', err);
      res.status(500).json({ message: 'ERROR AL REALIZAR LA CONSULTA' });
    } else {

      if (result.rows.length > 0) {
        if (result.rows[0].id_role === 2 || result.rows[0].id_role ===  3) {

          if(typeof _password === 'string'){

            const valid = await ComparedPassWord(_password, result.rows[0].hashed_password);

            if(valid){
              const usurario = {
                id_user : result.rows[0].id,
                nombre : result.rows[0].nombre,
                cod_empleado : result.rows[0].cod_empleado,
                qr : result.rows[0].qr,
                type_ : result.rows[0].id_role
              }
              console.log('SE INGRESO VIA APP-END KELLER-CHECK');
              res.status(200).json({ data : usurario});
            }else{
              res.status(500).json({ message : 'usuario invalido'});
            }

          }else{
            console.log('LA CONTRASEÑA NO ES UN STRING');
            res.status(500).json({message : 'la contraseña no es un string'});
          }
                      
        
        } else {
          res.status(500).json({ message: 'NO ES UN GUARDIA O ENTREGADOR' });
        }

      } else {
        res.status(401).json({ message: 'USUARIO INVALIDO' });
      }
      
    }
  });
  
  } catch (err) {
  console.log('ERROR : ', err);
  res.status(500).json({message : 'no se pudo ingresar a la ruta'}) 
  }
}

