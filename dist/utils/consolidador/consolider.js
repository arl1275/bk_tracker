"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseConsolidation = void 0;
const ChooseConsolidation = (factura, IsToConsolidate, Data) => {
    // The "factura" variable, is used to know, if the process is manual or not
    // The "IsToConsolidate" variable, means, if the values of "Data" are going to be consolidate or unconsolidate.
    // Case "IsToConsolidate" variable is equal to NULL, it means the preprocess has been aborted, then this fuction will return a "FALSE"
    try {
        if (IsToConsolidate) {
            if (Data.length > 0) {
            }
            else {
                console.log('|| No hay datos para CONSOLIDAR');
                return [false, { message: 'No hay datos para CONSOLIDAR' }];
            }
        }
        else if (!IsToConsolidate) {
            if (Data.length > 0) {
            }
            else {
                console.log('|| No hay datos para DESCONSOLIDAR');
                return [false, { message: 'No hay datos para DESCONSOLIDAR' }];
            }
        }
        else if (IsToConsolidate === null) {
            return [false, { message: 'Ocurrio un error al consolidar' }];
        }
    }
    catch (err) {
        console.log('|| Erro al momento de sincronizar', err);
        return [false, { message: 'Error al intentar consolidar' }];
    }
    finally {
        console.log('||------------------------------------------------------------------------------------------------------------||');
    }
};
exports.ChooseConsolidation = ChooseConsolidation;
