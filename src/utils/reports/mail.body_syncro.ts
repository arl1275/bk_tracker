import * as nodemailer from 'nodemailer';
import connDB from '../db/localDB_config';
import { data_to_repots_of_syncro_facts_entregadas } from '../queries/works_querys';
import * as dotenv from 'dotenv';
dotenv.config();

async function return_data_toReports_Sincro_facts( data_ : number[]) {
    try {
      console.log('FUNCTION : return_data_toReports_Sincro_facts::: ', data_)
      const data : any[] = [];                 // save the list of facturas to send
      for (let i = 0; i < data_.length; i++) { 
        const element : number = data_[i];         // save elemente
        const queryResult = await connDB.query(data_to_repots_of_syncro_facts_entregadas(), [element]);
        data.push(queryResult.rows);
      }
      console.log('FUNCTION : return_data_toReports_Sincro_facts::: return ::: ', data)
      return data;
    } catch (err) {
      return false;
    }  
}


function generateTableHTML(data: any[]): string {
    //console.log('PARA EL HTML : ', data)
    let tableHTML = `
    <p>Se ha realizado ENTREGADO, las siguientes facturas : </p>
    <table border="1">
      <thead>
        <tr>
          <th>Pedido Venta</th>
          <th>Factura</th>
          <th>Cliente</th>
          <th>Albaran</th>
          <th>Ciudad</th>
          <th>Lista Empaque</th>
          <th>Declaracion de Envio</th>
          <th>Cajas</th>
          <th>Unidades</th>
          <th>Estado</th>
          <th>FIRMA</th>
          <th>REGISTRO</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {
    const facturaData = row[0]; // Acceder al primer elemento del arreglo dentro de cada objeto
    tableHTML += `
  <tr>
    <td>${facturaData?.pedidoventa}</td>
    <td>${facturaData?.factura}</td>
    <td>${facturaData?.clientenombre}</td>
    <td>${facturaData?.albaran}</td>
    <td>${facturaData?.ciudad}</td>
    <td>${facturaData?.lista_empaque}</td>
    <td>${facturaData?.declaracionenvio}</td>
    <td>${facturaData?.cant_cajas}</td>
    <td>${facturaData?.cant_total}</td>
    <td>${facturaData?.state_name}</td>
    <td><a href="${facturaData?.link_firma}">VER FIRMA</a></td>
    <td><a href="${facturaData?.link_foto}">VER FOTO</a></td>
  </tr>
`;
});

    tableHTML += `
      </tbody>
    </table>
  `;

    return tableHTML;
}

export async function sendEmail_Entregados( list_fact : number []) {
    try {

        let tableHTML;

        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: {
                user: `${process.env.CORREOFrom}`,
                pass: `${process.env.CORREOFromPass}`
            }
        });

        const data = await return_data_toReports_Sincro_facts(list_fact);
        if(Array.isArray(data)){
          tableHTML = generateTableHTML(data);
        }else{
          console.log('NO SE PUDO ENVIAR EL CORREO');
        }
        
        const mailOptions = {
            from: `${process.env.CORREOFrom}`,
            to: `${process.env.CORREO0}`, // ${process.env.CORREO1}, ${process.env.CORREO2}, ${process.env.CORREO3}, ${process.env.CORREO4}, ${process.env.CORREO5}, ${process.env.CORREO6}`
            subject: 'Reporte Automatico, Facturas en Transito',
            text : `Buen día. Se ha realizado la entrega de las siguientes facturas :  `,
            html: tableHTML
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado:', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
}




