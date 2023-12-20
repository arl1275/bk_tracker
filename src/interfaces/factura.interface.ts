
export interface factura_form {
    fecha : Date; //format day/month/year
    num_factura : number;
    nom_cliente : string;
    cant_cajas : number;
    cant_total : number;
    pais : "Honduras"; //default Value
    departamento: "San Pedro Sula"; //default value
    ubicacion : string;
    list_empaque : string;
    estado : "null"; //default value is null
}





