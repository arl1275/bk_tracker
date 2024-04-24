"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail_sincro = exports.sendEmail_transito = void 0;
const nodemailer = __importStar(require("nodemailer"));
const localDB_config_1 = __importDefault(require("../db/localDB_config"));
const works_querys_1 = require("../queries/works_querys");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function return_data_toReports_Sincro_facts(data_) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = [];
            for (let i = 0; i < data_.length; i++) {
                const element = data_[i];
                const queryResult = yield localDB_config_1.default.query(works_querys_1.data_to_repots_of_syncro_facts, [element]);
                data.push(queryResult.rows);
            }
            return data;
        }
        catch (err) {
            console.log('ERROR AL EJECUTAR CONSULTA:', err);
            return false;
        }
    });
}
function generateTableHTML(data) {
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
            console.log('Datos de la fila:', facturaData); // Depurar datos de la fila
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
        }
        else {
            console.log('Datos de la fila vacíos o no válidos:', row);
        }
    });
    tableHTML += `
      </tbody>
    </table>
  `;
    return tableHTML;
}
function sendEmail_transito(list_fact) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const data = yield return_data_toReports_Sincro_facts(list_fact);
            if (Array.isArray(data)) {
                tableHTML = generateTableHTML(data);
            }
            else {
                console.log('NO SE PUDO ENVIAR EL CORREO');
            }
            const mailOptions = {
                from: `${process.env.CORREOFrom}`,
                to: `${process.env.CORREO0}`, // ${process.env.CORREO1}, ${process.env.CORREO2}, ${process.env.CORREO3}, ${process.env.CORREO4}, ${process.env.CORREO5}, ${process.env.CORREO6}
                subject: 'Reporte Automatico, Facturas en Transito',
                text: `Buen día. Se ha realizado un despacho de la bodega de las siguientes facturas: `,
                html: tableHTML
            };
            const info = yield transporter.sendMail(mailOptions);
            console.log('Correo electrónico enviado:', info.messageId);
        }
        catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    });
}
exports.sendEmail_transito = sendEmail_transito;
function sendEmail_sincro() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.sendEmail_sincro = sendEmail_sincro;
