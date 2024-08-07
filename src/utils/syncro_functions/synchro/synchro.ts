import { syncroData_AX_ } from './alter_synchro';
import * as cron from 'node-cron';

export async function syncroData_AX() {
  //await Full_Names_Update();
  const cronExpression = '*/5 * * * *'; // program to execute every 5 min

  cron.schedule(cronExpression, async () => {
    try {
      console.log('------------------------------ KRON TRIGGERED ------------------------------\n')
      await syncroData_AX_();
    } catch (error) {
      console.error('||    Error during syncroData_AX:', error);
    }finally{
      console.log('------------------------------ KRON FINNISHED ------------------------------\n')
    }
  })

};
