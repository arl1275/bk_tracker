import { Router } from "express";
import {
        get_all_info_from_one_conTransportista, get_all_tranportistas,
        post_one_consolidate_transportistas_controller,
        get_all_info_of_one_conTransportista_controller,
        createNewTransportista,
        DelTransportistaController
} from "../controllers/transportistas.controller";

const routerTransportista = Router();

routerTransportista.get('/transportistas', get_all_tranportistas);

routerTransportista.get('/contransOneInfo', get_all_info_from_one_conTransportista);

routerTransportista.get('/getcontrasbyid', get_all_info_of_one_conTransportista_controller);

routerTransportista.post('/postcontras', post_one_consolidate_transportistas_controller);

routerTransportista.post('/CreateNewTrans', createNewTransportista);

routerTransportista.delete('/delTrans', DelTransportistaController);

export = routerTransportista;