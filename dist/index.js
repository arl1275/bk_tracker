"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
require("dotenv").config({ path: './.env' });
const cors = require('cors');
const facturas_routes_1 = __importDefault(require("./routes/facturas.routes"));
const camion_routes_1 = __importDefault(require("./routes/camion.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const declaracion_env_routes_1 = __importDefault(require("./routes/declaracion_env.routes"));
const express = require("express");
const app = express();
//syncroData_AX_()
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.get("/", (req, res) => {
    res.status(200).json({ message: 'is conn' });
});
app.use("/facturas", facturas_routes_1.default);
app.use("/camiones", camion_routes_1.default);
app.use('/usuarios', user_routes_1.default);
app.use('/decEnv', declaracion_env_routes_1.default);
app.listen(3000, () => {
    console.log('Server en LINEA. En puerto :', 3000);
});
