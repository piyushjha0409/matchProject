import axios, { AxiosResponse } from "axios";
import { makeRequest } from "./utils/requestHandler.js";
import { logger } from "./utils/logger.js";
import fs from "fs";
import { configDotenv } from "dotenv";

configDotenv();

// API KEYS
const COINGECKO_API = process.env.COINGECKO_API_KEY as string;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY2 as string;
const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY as string;

//
export async function fetchHistoricalTokenData(address: string, chain: string) {
  try {
    // Fetch token metadata from CoinGecko
    const metadataResponse = await makeRequest(
      `https://pro-api.coingecko.com/api/v3/onchain/networks/${chain}/tokens/${address}`,
      {
        headers: { "x-cg-pro-api-key": COINGECKO_API },
      }
    );

    const metadata = metadataResponse;
    const coinId = metadata.data?.attributes.coingecko_coin_id;

    // logger.log(`This is the metadata response ${metadata.data}`, 'DEBUG');
    
    // Fetch historical price & market cap (6h, 12h, 24h)
    const historicalData = await fetchHistoricalPriceData(coinId);
    
    // Fetch transaction count
    const transactions = await getTransactionCount(address);
    
    // Fetch holders count
    const holders = await getTokenHolderCount(address);
    
    const result = {
      address,
      name: metadata.data?.attributes.name,
      symbol: metadata.data?.attributes.symbol,
      historicalData: {
        "6h": {
          price: historicalData ? historicalData["6h"].price : 0,
          marketCap: historicalData ? historicalData["6h"].marketCap : 0,
          volume: historicalData ? historicalData["6h"].volume : 0,
          transactionCount: transactions ? transactions["6h"] : 0,
          holdersCount: holders ? holders["6h"] : 0,
        },
        "12h": {
          price: historicalData ? historicalData["12h"].price : 0,
          marketCap: historicalData ? historicalData["12h"].marketCap : 0,
          volume: historicalData ? historicalData["12h"].volume : 0,
          transactionCount: transactions ? transactions["12h"] : 0,
          holdersCount: holders ? holders["12h"] : 0,
        },
        "24h": {
          price: historicalData ? historicalData["24h"].price : 0,
          marketCap: historicalData ? historicalData["24h"].marketCap : 0,
          volume: historicalData ? historicalData["24h"].volume : 0,
          transactionCount: transactions ? transactions["24h"] : 0,
          holdersCount: holders ? holders["24h"] : 0,
        },
        "48h": {
          price: historicalData ? historicalData["48h"].price : 0,
          marketCap: historicalData ? historicalData["48h"].marketCap : 0,
          volume: historicalData ? historicalData["48h"].volume : 0,
          transactionCount: transactions ? transactions["48h"] : 0,
          holdersCount: holders ? holders["48h"] : 0,
        },
        "7d": {
          price: historicalData ? historicalData["7d"].price : 0,
          marketCap: historicalData ? historicalData["7d"].marketCap : 0,
          volume: historicalData ? historicalData["7d"].volume : 0,
          transactionCount: transactions ? transactions["7d"] : 0,
          holdersCount: holders ? holders["7d"] : 0,
        },
        "30d": {
          price: historicalData ? historicalData["30d"].price : 0,
          marketCap: historicalData ? historicalData["30d"].marketCap : 0,
          volume: historicalData ? historicalData["30d"].volume : 0,
          transactionCount: transactions ? transactions["30d"] : 0,
          holdersCount: holders ? holders["30d"] : 0,
        },
      },
    };
    fs.writeFileSync(`HistoricalData.json`, JSON.stringify(result, null, 2));

    logger.log("Succesfully written the output file", "INFO");

    return result;
  } catch (error) {
    logger.log(`Failed fetchHistoricalData: ${error}`, "ERROR");
  }
}

/**
 * Fetch historical price and market cap data from CoinGecko.
 */
async function fetchHistoricalPriceData(coinId: string) {
  try {
    const days = 30; // Fetching max required days in a single call
    const response = await makeRequest(
      `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: { "x-cg-pro-api-key": COINGECKO_API },
      }
    );
    if (!response) throw "Failed API Call";

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
    logger.log(`Failed fetchHistoricalPriceData: ${error}`, "ERROR");
  }
}

/**
 * Fetch holders count for Solana or EVM.
 */
async function getTokenHolderCount(address: string) {
  const timeFrames = {
    "6h": new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    "12h": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    "24h": new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    "48h": new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    "7d": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    "30d": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const results: Record<string, number | null> = {};

  for (const [label, after] of Object.entries(timeFrames)) {
    try {
      const query = JSON.stringify({
        query: `{
        Solana {
          BalanceUpdates(
            where: {
              BalanceUpdate: {
                PostBalance: {gt: "0"},
                Currency: {
                  MintAddress: {is: "${address}"}
                }
              }, 
              Block: {
                Time: {after: "${after}"}
              }
            }
          ) {
            holders: count(distinct: BalanceUpdate_Account_Owner)
          }
        }
      }
    `,
        variables: "",
      });
      logger.log(
        `Fetching transaction count for the ${label} interval`,
        "INFO"
      );
      const response: AxiosResponse = await makeRequest(
        "https://streaming.bitquery.io/eap",
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
      if(!response) throw "Failed api call";
      const holdersCount =
        response?.data?.Solana?.BalanceUpdates[0]?.holders || 0;
      results[label] = holdersCount;
    } catch (error) {
      logger.log(`Failed getTokenHolderCount: ${error}`, "ERROR");
    }
  }
  return results;
}

/**
 * Function for getting the transactions count
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

      const response: AxiosResponse = await makeRequest(
        "https://streaming.bitquery.io/eap",
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
      const trades = response.data.Solana.DEXTradeByTokens[0]?.trades || 0;
      results[interval] = trades;
    } catch (error) {
      logger.log(`Error fetching data for ${interval}:`, "ERROR");
    }
  }
  logger.log(`This are the transaction counts ${results.length}`, "INFO");
  return results;
}
