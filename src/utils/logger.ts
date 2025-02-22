import { resolve } from 'path';
import { fileURLToPath } from 'url';
import chalk, { type ChalkInstance } from 'chalk';
import fs from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

type logType = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
type ColorsObject = Record<logType, ChalkInstance>

const logColors = {
   'ERROR': chalk.bold.red,
   'WARN': chalk.bold.yellow,
   'INFO': chalk.bold.hex('#00ffdd'),
   'DEBUG': chalk.bold.hex('#b7ff00'),
} as const satisfies ColorsObject

class LoggerInstance {
   readonly #logFile: string;
   verboseLevel: number = 0;

   // Create a log file  with the current date & time as the name
   constructor() {
      let now: Date = new Date;
      let date: string = now.getDate().toString().padStart(2, '0');
      let month: string = (now.getMonth() + 1).toString().padStart(2, '0');
      let year: string = now.getFullYear().toString();
      let time: string = now.toTimeString().slice(0, 8).replaceAll(':', '_');
      let dir = resolve(__dirname, '../logs');

      // Get the absolute path & create file / dir
      this.#logFile = resolve(dir, `${year}_${month}_${date}_${time}.log`);
      !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;
      fs.writeFileSync(this.#logFile, '');
   }

   // Append time of message & write to file alongside writing to stdout
   log(any: any, level: logType): void {
      if (typeof any === 'object') {
         any = JSON.stringify(any);
      } else {
         any = any.toString()
      }

      let date: Date = new Date;
      let text: string = `${chalk.bold.white(`[${date.toTimeString().slice(0, 8)}]`)} ${logColors[level](`[${level}] ${any || 'undefined/null'}`)}`;
      fs.appendFileSync(this.#logFile, text.replace(/\x1b\[[0-9;]*m/g, '') + '\n');

      if (level == 'ERROR' && this.verboseLevel < 0) return;
      if (level == 'WARN' && this.verboseLevel < 1) return;
      if (level == 'INFO' && this.verboseLevel < 2) return;
      if (level == 'DEBUG' && this.verboseLevel < 3) return;
      console.log(text);
   }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const logger: LoggerInstance = new LoggerInstance();

export { logger, delay }