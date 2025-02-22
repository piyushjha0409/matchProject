import { logger } from "./logger.js";

export async function makeRequest(url: string, init?: RequestInit, maxTry = 3): Promise<any | null> {
   while (maxTry > 0) {
      try {
         logger.log(`Attempting to fetch ${url} | Remaining Tries: ${maxTry}`, 'DEBUG');
         const resp = await fetch(url, init);
         if (resp.status != 200) throw `INVALID STATUS CODE ${resp.status}`;
         const response = await resp.json();
         logger.log(`Response data: ${JSON.stringify(response)}`, 'DEBUG');
         return response;
      } catch (error) {
         logger.log(`Error while making request: ${error}`, 'ERROR');
         --maxTry;
      }
   }
   return null;
}