//imports
import { Request, Response, NextFunction} from 'express';
import bodyParser = require('body-parser');
import { syncroData_AX_ } from './utils/syncro_functions/synchro/alter_synchro';

require("dotenv").config({path: './.env'});
const cors = require('cors');

import routerFacturas from './routes/facturas.routes';
import routerCamiones from './routes/camion.routes';
import routerUser from './routes/user.routes';
import routerDec_env from './routes/declaracion_env.routes';

const express = require("express");
const app = express();

//syncroData_AX_()

app.use(cors());
app.use(bodyParser.json({limit : '50mb'})); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get("/", (req : Request, res : Response)=>{
    res.status(200).json({message : 'is conn'});
})

app.use("/facturas", routerFacturas);
app.use("/camiones", routerCamiones);
app.use('/usuarios', routerUser);
app.use('/decEnv', routerDec_env);

app.listen(3000, ()=>{
    console.log('Server en LINEA. En puerto :', 3000);
});