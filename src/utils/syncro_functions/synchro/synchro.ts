import { NORMAL_insert_process_of_synchro } from "./synchro_process";
import { UpdateFacturasChanges } from "../special_synchro/special_synchro";
import * as cron from 'node-cron';

export async function syncroData_AX() {
    //  const cronExpression = '*/5 * * * *'; // program to execute every 30 min

    //  cron.schedule(cronExpression, async () => {
    //    try {
       console.log('KRON TRIGGERED')  
    await NORMAL_insert_process_of_synchro();
    //await UpdateFacturasChanges();
      // } catch (error) {
      //   console.error('Error during syncroData_AX:', error);
      // }})
};
