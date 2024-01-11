import { Request, Response } from "express";
import connDB from "../utils/psql_connection";


//----------------------------------------------------
//          GENERAL FUNCTIONS
//----------------------------------------------------

export let get_all_camiones_service = async (req: Request, res : Response)=>{

    try{
        connDB.query('SELECT * FROM camiones', (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              res.status(200).json({ data: result.rows });
            }
          });
    }catch(err){
        res.status(500).json({message : 'err al enviar solucitud'});
    }

}

//----------------------------------------------------
//          CRUD FUNCTIONS
//----------------------------------------------------

export let get_camion_by_id_service =async (req : Request, res : Response) => {
  try {
    const [id] = req.body;
    const query = 'SELECT * FROM camiones WHERE id = ($1)';
    connDB.query(query,[id], (err, result)=>{
      if(err){
        res.status(500).json({message : 'erro al obtner camion'})
      }else{
        res.status(200).json({data : result.rows});
      }
    })
  } catch (error) {
    res.status(500).json({message : 'err al enviar solucitud'})
  }
  
}

export let post_new_camion_service = async(req : Request, res : Response) =>{
  try {
    const {placa, QR} = req.body;
    const query = 'INSERT INTO camiones (placa, QR) values ($1, $2)';
    connDB.query(query, [placa, QR], (err, result) =>{
      if(err){
        res.status(500).json({message : 'error al crear camion'});
        console.log('ERROR : crear camion => ', err);
      }else{
        res.status(200).json({message : 'se creo camion'});
      }
    })
  } catch (error) {
    res.status(500).json({message : 'err al enviar solucitud'})
  }
}

export let update_placa_camion_service =async (req : Request, res : Response) => {
  try {
    const [id, placa] = req.body;
    const query = 'UPDATE camiones SET placa = ($1) WHERE id = ($2)';
    connDB.query(query, [placa, id], (err, result) =>{
      if(err){
        res.status(500).json({message : 'ERROR al modificar placa'});
      }else{
        res.status(200).json({message : 'Se actualizo camion'})
      }
    })
  } catch (error) {
    res.status(500).json({message : 'err al enviar solucitud'})
  }
  
}

export let update_QR_camion_service =async (req : Request, res : Response) => {
  try {
    const [id, QR] = req.body;
    const query = 'UPDATE camiones SET QR = ($1) WHERE id = ($2)';
    connDB.query(query, [QR, id], (err, result) =>{
      if(err){
        res.status(500).json({message : 'ERROR al modificar QR'});
      }else{
        res.status(200).json({message : 'Se actualizo QR'})
      }
    })
  } catch (error) {
    res.status(500).json({message : 'err al enviar solucitud'})
  }
  
}

export let delete_one_camion_service =async (req : Request, res : Response) => {
  try {
    const [id] = req.body;
    const query = 'DELETE FROM camiones WHERE id = ($1)';
    connDB.query(query, [id], (err, result) =>{
      if(err){
        res.status(500).json({message : 'ERROR al eliminar camion'});
      }else{
        res.status(200).json({message : 'Se elimino camion'})
      }
    })
  } catch (error) {
    res.status(500).json({message : 'err al enviar solucitud'})
  }
  
}