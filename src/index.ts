//imports
import { Request, Response, NextFunction} from 'express';
import bodyParser = require('body-parser');
import { syncroData_AX } from './utils/syncro_functions/synchro/synchro';

require("dotenv").config({path: './.env'});
const cors = require('cors');

//import routes for app-----------
import routerFacturas from './routes/facturas.routes';
import routerCamiones from './routes/camion.routes';
import routerUser from './routes/user.routes';
import routerDec_env from './routes/declaracion_env.routes';
//import routerEntregas from './routes/entregas.routes';
// import routerConsolidados from './routes/consolidados.routes';

//import connDB from '../DBconnection/tracker_db'

//--------------------------------

const express = require("express");
const app = express();

syncroData_AX()

app.use(cors());
app.use(bodyParser.json({limit : '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get("/conn", (req : Request, res : Response)=>{
    res.status(200).json({message : 'is conn'});
})

app.use("/facturas", routerFacturas);
app.use("/camiones", routerCamiones);
app.use('/usuarios', routerUser);
app.use('/decEnv', routerDec_env);
// app.use('/dec_envio', routerConsolidados);


//se enciende el servidor
app.listen(3000, ()=>{
    console.log('Server en LINEA. En puerto :', 3000);
});