import fs from "fs";
import { Connection, PublicKey } from "@solana/web3.js";
import { makeRequest } from "./utils/requestHandler.js";
import { logger } from "./utils/logger.js";
import { configDotenv } from "dotenv";

configDotenv();

const MORALIS_API_KEY = process.env.MORALIS_API_KEY2 as string;
const SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY as string;
const COINGECKO_API = process.env.COINGECKO_API_KEY as string;

export async function fetchTokenData(address: string, chain: string) {
  try {
    // Fetch token metadata using the updated API string
    const metadataResponse = await makeRequest(
      `https://pro-api.coingecko.com/api/v3/onchain/networks/${chain}/tokens/${address}`,
      {
        headers: {
          Accept: "application/json",
          "x-cg-pro-api-key": COINGECKO_API,
        },
      }
    );
    if (!metadataResponse)
      throw "[fetchTokenData] - Failed to get API response";
    const metadata = metadataResponse;

    // Fetch holders count and launch date
    const holders = await getTokenHolderCountAndLaunchDate(address);

    //for vaolume
    const totalVolume = await getTotalVolume(address, chain);

    //for transactions count
    const trasanctionCount = await getTransactionCount(address);

    const mintAddress = new PublicKey(address);
    // Construct the result object
    const liquidity = await getLiquidity(address, "mainnet");
    const result = {
      address,
      name: metadata.data.attributes.name,
      symbol: metadata.data.attributes.symbol,
      price: metadata.data.attributes.price_usd,
      marketCap: metadata.data.attributes.market_cap_usd,
      liquidity: liquidity,
      holders: holders.holder,
      volume: totalVolume,
      transactions: trasanctionCount,
      launchDate: new Date(holders?.created_time * 1000).toLocaleDateString(),
    };

    // Write the result to output.json
    fs.writeFileSync("SolOutput.json", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    logger.log(`failed fetchTokenData: ${error}`, "ERROR");
    throw error;
  }
}

/**
 *  Function for getting the liquidity
 * @param address
 * @param network
 * @returns
 */
async function getLiquidity(address: string, network: string) {
  try {
    const response = await makeRequest(
      `https://solana-gateway.moralis.io/token/${network}/${address}/pairs/stats`,
      {
        headers: {
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    );
    if (!response || !response.totalLiquidityUsd) throw "failed API call";
    logger.log(`success getLiquidity`, "INFO");
    return response.totalLiquidityUsd;
  } catch (error) {
    logger.log(`failed getLiquidity: ${error}`, "ERROR");
    return null;
  }
}

/**
 * function to fetch total volume of the usd in different time frames
 * @param coinId
 * @param contractAddress
 * @param currency
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
    if (!response) throw "failed API call";

    // Compute total volumes for each time frame
    const results = response.total_volumes;
    const getIndex = (hours: number) =>
      Math.floor((hours / (30 * 24)) * results.length);

    logger.log(`success getTotalVolume`, "INFO");
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
    return null;
  }
}

/**
 *@returns transactionm in specific time of intervals
 * @param address
 * @param chain
 */
async function getTransactionCount(address: string) {
  const timeFrames = {
    "6h": new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    "12h": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    "24h": new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    "48h": new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    "7d": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    "30d": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  let results: Record<string, number | null> = {};

  for (const [interval, since] of Object.entries(timeFrames)) {
    try {
      const till = new Date().toISOString(); // Current timestamp
      const query = JSON.stringify({
        query: `{
          Solana(network: solana) {
            DEXTradeByTokens(
              where: {
                Trade: {
                  Currency: {
                    MintAddress: {
                      is: "${address}"
                    }
                  }
                },
                Block: {
                  Time: {
                    since: "${since}",
                    till: "${till}"
                  }
                },
                Transaction: {
                  Result: {
                    Success: true
                  }
                }
              }
            ) {
              trades: count
              volume: sum(of: Trade_Amount)
            }
          }
        }`,
        variables: "",
      });
      logger.log(
        `Fetching transaction count for the ${interval} interval`,
        "INFO"
      );

      const response = await makeRequest("https://streaming.bitquery.io/eap", {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BITQUERY_API_KEY}`,
        },
        redirect: "follow",
      });
      const trades = response.data.Solana.DEXTradeByTokens[0]?.trades || 0;
      results[interval] = trades;
      logger.log(`success getTransactionCount for ${interval}`, "INFO");
    } catch (error) {
      logger.log(`failed getTransactionCount ${interval}: ${error}`, "ERROR");
    }
  }
  return results;
}

/**
 * Fetches token holder count from Solscan API.
 * @param address Token mint address.
 * @returns Holders count in different time intervals.
 */
async function getTokenHolderCountAndLaunchDate(address: string) {
  try {
    const response = await makeRequest(
      `https://pro-api.solscan.io/v2.0/token/meta?address=${address}`,
      {
        headers: {
          accept: "application/json",
          token: SOLSCAN_API_KEY,
        },
      }
    );

    if (!response || !response.data || response.data.length === 0) {
      logger.log("No holder data found.", "WARN");
      return null;
    }
    logger.log(`success getTokenHolderCountAndLaunchDate`, "INFO");
    // Extract holder count from API response
    const metadata = response.data;

    //return the metadata holder
    return metadata;
  } catch (error) {
    logger.log(`failed getTokenHolderCountAndLaunchDate: ${error}`, "ERROR");
    return null;
  }
}
