import { makeRequest } from "./utils/requestHandler.js";
import { logger } from "./utils/logger.js";
import { configDotenv } from "dotenv";
import fs from "fs";

configDotenv();

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY as string;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY as string;
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY as string;

/**
 * Main Function
 * @param address
 * @param chain
 * @returns
 */
export async function getHistoricalEVMTokenData(
  address: string,
  chain: string
) {
  try {
    const metadataResponse = await makeRequest(
      `https://pro-api.coingecko.com/api/v3/onchain/networks/${chain}/tokens/${address}`,
      {
        method: "GET",
        headers: {
          "x-cg-pro-api-key": COINGECKO_API_KEY,
        },
      }
    );

    if (!metadataResponse) throw "Failed to fetch metadata of the token";

    const coinId = metadataResponse.data.attributes.coingecko_coin_id;

    const historicalData = await fetchHistoricalPriceData(coinId);
    const launchDateAndMarketCap = await getLaunchDateAndMarketCap(
      address,
      chain
    );
    const launchDate = launchDateAndMarketCap?.launchDate;
    const marketCap = launchDateAndMarketCap?.marketCap;
    const holdersData = await getHoldersCount(address, chain);

    const txCount = await getTransactionCount(address);

    if (
      historicalData !== null &&
      holdersData !== null &&
      launchDate !== null &&
      marketCap !== null
    ) {
      const result = {
        address,
        name: metadataResponse.data.attributes.name,
        symbol: metadataResponse.data.attributes.symbol,
        launchDate: launchDate,
        marketCap: marketCap,
        historicalData: {
          "6h": {
            price: historicalData["6h"].price | 0,
            marketCap: historicalData["6h"].marketCap,
            volume: historicalData["6h"].volume,
            holdersData: holdersData["6h"],
            transactionCount: txCount["6h"],
          },
          "12h": {
            price: historicalData["12h"].price,
            marketCap: historicalData["12h"].marketCap,
            volume: historicalData["12h"].volume,
            holdersData: holdersData["12h"],
            transactionCount: txCount["12h"],
          },
          "24h": {
            price: historicalData["24h"].price,
            marketCap: historicalData["24h"].marketCap,
            volume: historicalData["24h"].volume,
            holdersData: holdersData["24h"],
            transactionCount: txCount["24h"],
          },
          "48h": {
            price: historicalData["48h"].price,
            marketCap: historicalData["48h"].marketCap,
            volume: historicalData["48h"].volume,
            holdersData: holdersData["48h"],
            transactionCount: txCount["48h"],
          },
          "7d": {
            price: historicalData["7d"].price,
            marketCap: historicalData["7d"].marketCap,
            volume: historicalData["7d"].volume,
            holdersData: holdersData["7d"],
            transactionCount: txCount["7d"],
          },
          "30d": {
            price: historicalData["30d"].price,
            marketCap: historicalData["30d"].marketCap,
            volume: historicalData["30d"].volume,
            holdersData: holdersData["30d"],
            transactionCount: txCount["30d"],
          },
        },
      };

      fs.writeFileSync(
        `HistoricalEVMToken.json`,
        JSON.stringify(result, null, 2)
      );
      logger.log(
        `Successfully written data into HistoricalEVMToken.json json file`,
        "INFO"
      );
      return result;
    }
  } catch (err) {
    logger.log(`Something went wrong with ${err}`, "ERROR");
  }
}

/**
 * Function for fetching the launch date and the market cap
 * @param address
 * @param chain
 * @returns
 */
async function getLaunchDateAndMarketCap(address: string, chain: string) {
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

    return {
      launchDate: response[0].created_at,
      marketCap: response[0].market_cap,
    };
  } catch (error) {
    logger.log(`failed fetchTokenDetails: ${error}`, "ERROR");
  }
}

/**
 *  This function is for fetching the details of the token
 * @param coinId
 * @returns
 */
//TODO: to rectify this for first 
async function fetchHistoricalPriceData(coinId: string) {
  try {
    const days = 30; // Fetching max required days in a single call
    const response = await makeRequest(
      `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: { "x-cg-pro-api-key": COINGECKO_API_KEY },
      }
    );

    if (!response) throw "Failed to call fetchHistoricalPriceData";

    const prices = response.prices;
    const marketCaps = response.market_caps;
    const volumes = response.total_volumes;

    const getIndex = (hours: number) =>
      Math.floor((hours / (days * 24)) * prices.length);

    return {
      "6h": {
        price: prices[getIndex(6)][1],
        marketCap: marketCaps[getIndex(6)][1],
        volume: volumes[getIndex(6)][1],
      },
      "12h": {
        price: prices[getIndex(12)][1],
        marketCap: marketCaps[getIndex(12)][1],
        volume: volumes[getIndex(12)][1],
      },
      "24h": {
        price: prices[getIndex(24)][1],
        marketCap: marketCaps[getIndex(24)][1],
        volume: volumes[getIndex(24)][1],
      },
      "48h": {
        price: prices[getIndex(48)][1],
        marketCap: marketCaps[getIndex(48)][1],
        volume: volumes[getIndex(48)][1],
      },
      "7d": {
        price: prices[getIndex(7 * 24)][1],
        marketCap: marketCaps[getIndex(7 * 24)][1],
        volume: volumes[getIndex(7 * 24)][1],
      },
      "30d": {
        price: prices[getIndex(30 * 24) - 1][1], // Get last available data for 30d
        marketCap: marketCaps[getIndex(30 * 24) - 1][1],
        volume: volumes[getIndex(30 * 24) - 1][1],
      },
    };
  } catch (error) {
    logger.log(`Error fetching the Historical Data ${error}`, "ERROR");
    return null;
  }
}

/**
 * Function for getting the holders count
 * @param address
 * @returns
 */

//TODO: to rectify this for first 
async function getHoldersCount(address: string, chain: string) {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 31);
    const toDate = new Date();

    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    let allHoldersData: { timestamp: string; totalHolders: number }[] = [];
    let cursor = null;

    do {
      const response = await makeRequest(
        `https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders/historical?chain=${chain}&fromDate=${formatDate(
          fromDate
        )}&toDate=${formatDate(toDate)}&timeFrame=1h&cursor=${cursor}`,
        {
          headers: {
            "X-API-Key": MORALIS_API_KEY,
          },
        }
      );

      if (!response) {
        logger.log(`Error fetching the holders count`, "ERROR");
      }

      const holdersData: { timestamp: string; totalHolders: number }[] =
        response.result;

      if (holdersData && holdersData.length > 0) {
        allHoldersData = [...allHoldersData, ...holdersData];
      }

      cursor = response.cursor;
    } while (cursor);

    console.log("Total holders data fetched:", allHoldersData.length);

    if (allHoldersData.length === 0) {
      console.warn("No holders data found.");
      return null;
    }

    return processHoldersData(allHoldersData);
  } catch (error) {
    console.error("Error fetching holders count:", error);
    return null;
  }
}

/**
 * For processing the holders data to the token
 * @param holdersData
 * @returns
 */
function processHoldersData(
  holdersData: { timestamp: string; totalHolders: number }[]
) {
  const now = Date.now();

  const timeFrames = {
    "6h": 6 * 60 * 60 * 1000,
    "12h": 12 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "48h": 48 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  const results: Record<string, number | null> = {};

  // Convert timestamps to milliseconds
  const holdersDataWithTimestamp = holdersData.map(
    ({ timestamp, totalHolders }) => ({
      timestamp: new Date(timestamp).getTime(),
      totalHolders,
    })
  );

  // Find closest holders count for each time frame
  Object.entries(timeFrames).forEach(([label, duration]) => {
    const closestEntry = holdersDataWithTimestamp
      .filter(({ timestamp }) => now - timestamp >= duration)
      .sort((a, b) => b.timestamp - a.timestamp)[0]; // Get closest past entry

    results[label] = closestEntry ? closestEntry.totalHolders : null;
  });

  console.log(
    "Processed Holders Count for different time frames:",
    results.length
  );
  return results;
}

/**
 * function for getting the transaction count in specific time intervals
 * @param address
 * @param chain
 */

//TODO: to rectify this for first 
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
      const till = new Date().toISOString();
      const query = `{
        EVM(network: eth, dataset: combined) {
          DEXTrades(
            where: {Block: {Time: {since: "${since}", till: "${till}"}},
              TransactionStatus: {Success: true},
              Trade: {Buy: {Currency: {SmartContract: {is: "${address}"}}}}
            }
          ) {
            trades: count
          }
        }
      }`;

      console.log(
        `Fetching the transactions count for the ${interval} interval`
      );

      const response = await makeRequest(
        "https://streaming.bitquery.io/graphql",
        {
          method: "POST",
          body: JSON.stringify({ query }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BITQUERY_API_KEY}`,
          },
          redirect: "follow",
        }
      );

      if (!response.data) {
        throw new Error(`Invalid response for ${interval}`);
      }

      const trades = response.data.EVM.DEXTrades[0]?.trades || 0;
      results[interval] = trades;
    } catch (err) {
      logger.log(`This is the error ${err}`, "ERROR");
    }
  }

  return results;
}
