import * as nodemailer from 'nodemailer';
import connDB from '../db/localDB_config';
import { data_to_repots_of_syncro_facts } from '../queries/works_querys';
import * as dotenv from 'dotenv';
dotenv.config();

async function return_data_toReports_Sincro_facts( data_ : number[]) {
  try {
    const data: any[] = [];
  
    for (let i = 0; i < data_.length; i++) {
      const element = data_[i]; 
      const queryResult = await connDB.query(data_to_repots_of_syncro_facts, [element]);
      data.push(queryResult.rows);
    }
  
    return data;
  } catch (err) {
    console.log('ERROR AL EJECUTAR CONSULTA:', err);
    return false;
  }
  
}


function generateTableHTML(data: any[]): string {
    //console.log('PARA EL HTML : ', data)
    let tableHTML = `
    <p>Se ha realizado el despacho a TRANSITO, de las siguientes facturas : </p>
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
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {
    if (row && row.length > 0) {
      const facturaData = row[0]; // Acceder al primer elemento del arreglo dentro de cada objeto
      //console.log('Datos de la fila:', facturaData); // Depurar datos de la fila

      tableHTML += `
        <tr>
          <td>${facturaData.pedidoventa}</td>
          <td>${facturaData.factura}</td>
          <td>${facturaData.clientenombre}</td>
          <td>${facturaData.albaran}</td>
          <td>${facturaData.ciudad}</td>
          <td>${facturaData.lista_empaque}</td>
          <td>${facturaData.declaracionenvio}</td>
          <td>${facturaData.cant_cajas}</td>
          <td>${facturaData.cant_total}</td>
          <td>${facturaData.state_name}</td>
        </tr>
      `;
    } else {
      console.log('Datos de la fila vacíos o no válidos:', row);
    }
  });

    tableHTML += `
      </tbody>
    </table>
  `;

    return tableHTML;
}

export async function sendEmail_transito( list_fact : number []) {
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
            to: `${process.env.CORREO0}`, // ${process.env.CORREO1}, ${process.env.CORREO2}, ${process.env.CORREO3}, ${process.env.CORREO4}, ${process.env.CORREO5}, ${process.env.CORREO6}
            subject: 'Reporte Automatico, Facturas en Transito',
            text : `Buen día. Se ha realizado un despacho de la bodega de las siguientes facturas: `,
            html: tableHTML
        };

        const info = await transporter.sendMail(mailOptions);
        //console.log('Correo electrónico enviado:', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
}

export async function sendEmail_sincro(){  
    
}

