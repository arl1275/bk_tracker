import { NORMAL_insert_process_of_synchro } from "./synchro_process";
import * as cron from 'node-cron';

export async function syncroData_AX() {
  // const cronExpression = '*/30 * * * *'; // program to execute every 30 min

  // cron.schedule(cronExpression, async () => {
  //   try {
  //    Execute the function
      await NORMAL_insert_process_of_synchro();
    // } catch (error) {
    //   console.error('Error during syncroData_AX:', error);
    // }})
};
