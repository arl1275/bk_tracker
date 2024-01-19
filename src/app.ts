//imports cosas que cambie
import { Request, Response, NextFunction} from 'express';
import bodyParser = require('body-parser');
import { getDataFromTempTable } from './utils/factDataProvider';


require("dotenv").config({path: './.env'});
const cors = require('cors');

//import routes for app-----------
import routerFacturas from './routes/facturas.routes';
import routerCamiones from './routes/camion.routes';
import routerUser from './routes/user.routes';
import routerTransportista = require('./routes/transportistas.routes');
import routerEntregas from './routes/entregas.routes';
import routerConsolidados from './routes/consolidados.routes';

//import connDB from '../DBconnection/tracker_db'

//--------------------------------

const express = require("express");
const app = express();

getDataFromTempTable();


app.use(cors());
app.use(bodyParser.json({limit : '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get("/", (req : Request, res : Response)=>{
    res.send('Hola mundo');
})

app.get("/about", (req : Request, res : Response)=>{
    res.send('Esto es un apartado aparte.');
})

app.use("/fact", routerFacturas);
app.use("/camiones", routerCamiones);
app.use('/user', routerUser);
app.use('/trans', routerTransportista);
app.use('/entregas', routerEntregas);
app.use('/cons', routerConsolidados);


//se enciende el servidor
app.listen(3000, ()=>{
    console.log('Server en LINEA. En puerto :', 3000);
});