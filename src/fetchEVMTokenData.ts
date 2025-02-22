import fs from "fs";
import { makeRequest } from "./utils/requestHandler.js";
import { logger } from "./utils/logger.js";

import { configDotenv } from "dotenv";
configDotenv();

// Configuration
const MORALIS_API_KEY = process.env.MORALIS_API_KEY as string;
const COINGECKO_API = process.env.COINGECKO_API_KEY as string;
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY as string;

/**
 * Fetch real-time token data using Moralis API
 * @param {string} address - Token contract address
 * @param {string} chain - Blockchain identifier ('eth', 'solana', etc.)
 */
export async function fetchRealTimeTokenDataOnEVM(
  address: string,
  chain: string
) {
  try {
    const tokenData = await fetchTokenDetails(address, chain);
    const tokenPrice = await getTokenPrice(address, chain);
    const totalLiquidity = await getLiquidity(address, chain);
    const holdersData = await getHoldersData(address, chain);
    const totalVolume = await getTotalVolume(address, chain);
    const transactionCount = await getTransactionCount(address, chain);

    //create an empty object to store the data
    const result = {
      address,
      name: tokenData[0]?.name,
      symbol: tokenData[0]?.symbol,
      price: tokenPrice,
      marketCap: tokenData[0]?.market_cap,
      liquidity: totalLiquidity,
      volume: totalVolume,
      transactions: transactionCount,
      holders: holdersData?.totalHolders,
      launchDate: tokenData[0]?.created_at,
    };

    //write the tokenData to the output2.json
    fs.writeFileSync("EVMToken.json", JSON.stringify(result, null, 2));
    logger.log("Data written to EVMToken.json", "INFO");

    return result;
  } catch (error) {
    console.error("Error fetching token data:", error);
    throw error;
  }
}

/**
 * Fetch liquidity, volume, and live price using Moralis API
 */
async function fetchTokenDetails(address: string, chain: string) {
  try {
    const response = await makeRequest(
      `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chain}&addresses=${address}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
        redirect: "follow",
      }
    );
    logger.log(`This is the response ${response.data}`, "INFO");

    if (!response) {
      throw "Failed to call fetchTokenDetails";
    }

    return response;
  } catch (error) {
    logger.log(`failed fetchTokenDetails: ${error}`, "ERROR");
  }
}

/**
 * Function for getting the real time liquidity of an EVM token
 * @param address
 * @param chain
 */
async function getLiquidity(address: string, chain: string) {
  try {
    const response = await makeRequest(
      `https://deep-index.moralis.io/api/v2.2/erc20/${address}/pairs/stats?chain=${chain}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
        redirect: "follow",
      }
    );

    if (!response) throw "Failed to call get holders";

    return response.total_liquidity_usd;
  } catch (error) {
    logger.log(`Failed getLIquidity function ${error}`, "ERROR");
  }
}

/**
 *  Function to get the price
 * @param address
 * @param chain
 */
async function getTokenPrice(address: string, chain: string) {
  try {
    const response = await makeRequest(
      `https://deep-index.moralis.io/api/v2.2/erc20/${address}/price?chain=${chain}`,
      {
        headers: {
          "X-Api-Key": MORALIS_API_KEY,
        },
      }
    );

    if (!response) throw "Failed to call get Price";

    return response.usdPrice;
  } catch (err) {
    logger.log(`Error fetching the price of the token`, "ERROR");
  }
}

/**
 * Fetch EVM-specific data (holder count, launch date placeholder)?
 * @param {string} address - Token contract address
 * @returns market cap, holders count, and launch date for EVM tokens
 */

async function getHoldersData(address: string, chain: string) {
  try {
    const tokenHolders = await makeRequest(
      `https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders?chain=${chain}`,
      {
        headers: {
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    );

    if (!tokenHolders) {
      throw "Failed to call the get Holders API call";
    }

    console.log("Holders data", tokenHolders);

    return tokenHolders;
  } catch (error) {
    logger.log(`failed getHoldersData: ${error}`, "ERROR");
  }
}

/**
 *  function for getting the volume in time formats
 * @param address
 * @param chain
 * @returns
 */
async function getTotalVolume(address: string, chain: string) {
  try {
    // Fetch the market chart data (max 30 days)
    const response = await makeRequest(
      `https://pro-api.coingecko.com/api/v3/coins/${chain}/contract/${address}/market_chart?vs_currency=usd&days=${30}`,

      {
        headers: {
          "x-cg-pro-api-key": COINGECKO_API,
        },
      }
    );

    if (!response) {
      throw "Failed to call get total volume";
    }

    // Compute total volumes for each time frame
    const results = response.total_volumes;
    // console.log("Total volumes", results);
    const getIndex = (hours: number) =>
      Math.floor((hours / (30 * 24)) * results.length);

    return {
      "6h": results[getIndex(6)][1],
      "12h": results[getIndex(12)][1],
      "24h": results[getIndex(24)][1],
      "48h": results[getIndex(48)][1],
      "7d": results[getIndex(7 * 24)][1],
      "30d": results[getIndex(30 * 24) - 1][1],
    };
  } catch (error) {
    logger.log(`failed getTotalVolume: ${error}`, "ERROR");
  }
}
/**
 *@returns transactionm in specific time of intervals
 * @param address
 * @param chain
 */
async function getTransactionCount(address: string, chain: string) {
  const timeFrames = {
    "6h": new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    "12h": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    "24h": new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    "48h": new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    "7d": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    "30d": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  let results: Record<any, any> = {};

  for (const [interval, since] of Object.entries(timeFrames)) {
    try {
      const till = new Date().toISOString();
      const query = JSON.stringify({
        query: `{
          EVM(network: ${chain}, dataset: combined) {
            DEXTrades(
              where: {Block: {Time: {since: "${since}", till: "${till}"}},
                TransactionStatus: {Success: true},
                Trade: {Buy: {Currency: {SmartContract: {is: "${address}"}}}}
              }
            ) {
              trades: count
            }
          }
        }`,
        variables: "",
      });

      const response = await makeRequest(
        "https://streaming.bitquery.io/graphql",
        {
          method: "POST",
          body: query,
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BITQUERY_API_KEY}`,
          },
        }
      );

      if (!response.data) {
        throw `Invalid response for ${interval}`;
      }

      logger.log(
        `This is the response for transaction count ${JSON.stringify(
          response.data
        )}`,
        "INFO"
      );
      const trades = response.data?.EVM?.DEXTrades[0]?.trades || 0;
      results[interval] = trades;
    } catch (err) {
      logger.log(`failed getTransactionCount: ${err}`, "ERROR");
    }
  }

  return results;
}
