import { Request, Response } from "express";
import connDB from "../utils/psql_connection";
import format from "pg-format";

//-------------------------------------------------------//
//            FUNCTIONS FOR TRANSPORTISTA                //
//-------------------------------------------------------//

export let get_all_tranportistas_service = async (req: Request, res: Response) => {
  try {
    connDB.query('SELECT * FROM transportista;', (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
      } else {
        //console.log('Query result:', result.rows);
        res.status(200).json({ data: result.rows });
      }
    });
  } catch (err) {
    console.error(`Ha ocurrido un error: ${err}`);
  }
}

export let get_one_transportista_info_by_id_service = async (req: Request, res: Response) => {
  const [nombre] = req.body
  const query = "SELECT * FROM tranportista WHERE id = ($1)"
  try {
    connDB.query(query, [nombre], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
      } else {
        console.log('Query result:', result.rows);
        res.status(200).json({ data: result.rows });
      }
    });
  } catch (err) {
    console.log('NO SE INICIO LA BUSQUEDA');
  }

}

//--------------------------------------------------------//
//     FUNCTIONS FOR CONSOLIDADO DE TRANSPORTISTA         //
//--------------------------------------------------------//
//genera un registro en la tabla de con_transportistas
export let generate_consolidados_transportista_service = async (req: Request, res: Response) => {
  try {
    const {id_entregador, id_transportista, id_camion, id_pais} = req.body;
    const query = 'INSERT INTO con_transportista (id_entregador, id_transportista, id_camion, id_pais) values ($1, $2, $3, $4)';
    connDB.query(query, [id_entregador, id_transportista, id_camion, id_pais], (err, result) => {
      if (err) {
        console.log('NO SE PUDO INSERTAR EN FACTURAS');
        res.status(500).json({ message: 'ERROR AL GENERAR consolidados_transportistas' });
      } else {
        console.log('SE INGRESO consolidado de transportistas');
        res.status(200).json({message : 'SE GENERO EL CONSOLIDADO'});
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'error al conectar con la base de datos' })
    console.log('error al generar consolidado')
  }
}

export let get_all_info_one_consTransportista_service = async (req: Request, res: Response) =>{
  try {
    const [id] = req.body;
    const query = "SELECT * FROM con_trasnportista WHERE id = ($1)";
    connDB.query(query, [id], (err, result) => {
      if(err){
        res.status(500).json({message : 'Error al obtener informacion de Consolidado TRansportista'});
      }else{
        console.log('SE OBTUBO LA INFORMACION DE UN SOLO CONSOLIDADO')
        res.status(200).json({data : result.rows});
      }
    })
  } catch (err) {
    console.log('err :', err)
    res.status(500).json({message : 'no se pudo acceder a la base de datos'});
  }
}

//--------------------------------------------------------//
//                      CRUD FUNCTIONS                    //
//--------------------------------------------------------//

export let createTransportista =async (req : Request, res : Response) => {
  try {
    const {nombre_emp} = req.body;
    const query = format('INSERT INTO transportista (nombre_empresa) VALUES %L', nombre_emp);
    connDB.query(query, (err, result)=>{
      if (err) {
        res.status(500).json({message : 'NO SE CREO TRANSPORTISTA'});
      } else {
        res.status(200).json({message : 'SE CREO USARIO'})
      }
    })
  } catch (err) {
    res.status(500).json({message : 'NO SE CREO TRANSPORTISTA'});
  }
  
}

export let DelTransportista =async (req : Request, res : Response) => {
  try {
    const {nombre_emp} = req.body;
    const query = format('DELETE FROM transportista WHERE id = %L', nombre_emp);
    connDB.query(query, (err, result)=>{
      if (err) {
        res.status(500).json({message : 'NO SE BORRO TRASNSPORTISTA'});
      } else {
        res.status(200).json({message : 'SE BORRO TRANSPORTISTA'})
      }
    })
  } catch (err) {
    res.status(500).json({message : 'NO SE BORRO TRANSPORTISTA'});
  }
  
}

