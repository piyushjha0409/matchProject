import { fetchHistoricalTokenData } from "./fetchSolHistory.js";
import { fetchTokenData } from "./fetchSolTokenData.js";
import { fetchRealTimeTokenDataOnEVM } from "./fetchEVMTokenData.js";
import { getHistoricalEVMTokenData } from "./fetchEVMHistory.js";
import { logger } from "./utils/logger.js";
import { configDotenv } from "dotenv";

export async function fetchTokenDetails(
  address: string,
  chain: string,
  historical: boolean
) {
  if (chain === "solana") {
    if (historical) {
      return await fetchHistoricalTokenData(address, chain);
    } else {
      return await fetchTokenData(address, chain);
    }
  } else {
    if (historical) {
      return await getHistoricalEVMTokenData(address, chain);
    } else {
      return await fetchRealTimeTokenDataOnEVM(address, chain);
    }
  }
}

configDotenv();
logger.verboseLevel = 4;
// const response = fetchHistoricalTokenData(
//   "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
//   "solana"
// );

// const response = fetchTokenDetails(
//   "0xdAC17F958D2ee523a2206206994597C13D831ec7",
//   "eth"
// );
