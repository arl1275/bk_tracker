"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncroData_AX = void 0;
const synchro_process_1 = require("./synchro_process");
function syncroData_AX() {
    return __awaiter(this, void 0, void 0, function* () {
        //  const cronExpression = '*/5 * * * *'; // program to execute every 30 min
        //  cron.schedule(cronExpression, async () => {
        //    try {
        console.log('KRON TRIGGERED');
        yield (0, synchro_process_1.NORMAL_insert_process_of_synchro)();
        //await UpdateFacturasChanges();
        // } catch (error) {
        //   console.error('Error during syncroData_AX:', error);
        // }})
    });
}
exports.syncroData_AX = syncroData_AX;
;
