"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnConsolidate = exports.Consolidador = exports.ChooseConsolidation = void 0;
const ChooseConsolidation = (IsToConsolidate, Data) => {
    // The "IsToConsolidate" variable, means, if the values of "Data" are going to be consolidate or unconsolidate.
    // Case "IsToConsolidate" variable is equal to NULL, it means the preprocess has been aborted, then this fuction will return a "FALSE"
    try {
        if (Data.length > 0) {
            if (IsToConsolidate === null) {
                return false;
            }
            else {
                if (IsToConsolidate) {
                }
                else {
                }
            }
        }
        else {
            console.log('|| NO HAY REGISTROS PARA CONSOLIDAR \n');
            return false;
        }
    }
    catch (err) {
        console.log('||  HA OCURRIDO UN ERROR AL CONSOLIDAR : ', err);
        return false;
    }
};
exports.ChooseConsolidation = ChooseConsolidation;
const Consolidador = (values) => {
    //THIS FUNCTION IS TO IDENTIFY CONSOLIDATIONS OF REGISTERS.
};
exports.Consolidador = Consolidador;
const UnConsolidate = (values) => {
    // THIS FUNCION IS TO REVERB CONSOLIDATINS PREVIUSLY MAKED
};
exports.UnConsolidate = UnConsolidate;
