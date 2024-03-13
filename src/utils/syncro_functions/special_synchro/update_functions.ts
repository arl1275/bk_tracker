import connDB from "../../db/localDB_config";

export const UpdateFacturaLater = async ( props : any[] ) => {
    return new Promise<boolean>((resolve, reject) => {
        try {
            const query = 'select * from update_referencia_factura( $1, $2, $3 )'

            if(Array.isArray(props)){
                for (let i = 0; i < props.length; i++) {
                    const element = props[i];

                    connDB.query(query, [element.id_pedi, element.id_fact, element.factura], (err, result)=>{
                        if(err){
                            console.log('||--|| NO SE PUDO ACTUALIZAR LA FACTURA ||--||');
                        }else{
                            console.log('||--|| SE HA ACTUALIZADO LA FACUTRA ||--||');
                        }
                    })
                }
            }

        } catch (err) {
           console.log('||--||  NO SE PUDO ACTUALIZAR LAS FACTURAS ||--||'); 
        }
    });
}