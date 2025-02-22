"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetchEVMHistory_js_1 = require("./fetchEVMHistory.js");
var logger_js_1 = require("./utils/logger.js");
var dotenv_1 = require("dotenv");
// async function fetchTokenDetails(address: string, chain: string) {
//    if (chain === "solana") {
//       await fetchTokenData(address, chain);
//       await fetchHistoricalTokenData(address, chain);
//    } else {
//       await fetchRealTimeTokenDataOnEVM(address, chain);
//       await getHistoricalEVMTokenData(address, chain);
//    }
// }
(0, dotenv_1.configDotenv)();
logger_js_1.logger.verboseLevel = 4;
// const response = fetchHistoricalTokenData(
//   "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
//   "solana"
// );
var response = (0, fetchEVMHistory_js_1.getHistoricalEVMTokenData)("0xdAC17F958D2ee523a2206206994597C13D831ec7", "eth");
