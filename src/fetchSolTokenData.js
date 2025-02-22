"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTokenData = fetchTokenData;
var fs_1 = require("fs");
var web3_js_1 = require("@solana/web3.js");
var requestHandler_js_1 = require("./utils/requestHandler.js");
var logger_js_1 = require("./utils/logger.js");
var dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
var MORALIS_API_KEY = process.env.MORALIS_API_KEY2;
var SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY;
var COINGECKO_API = process.env.COINGECKO_API_KEY;
function fetchTokenData(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var metadataResponse, metadata, holders, totalVolume, trasanctionCount, mintAddress, liquidity, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, (0, requestHandler_js_1.makeRequest)("https://pro-api.coingecko.com/api/v3/onchain/networks/".concat(chain, "/tokens/").concat(address), {
                            headers: {
                                Accept: "application/json",
                                "x-cg-pro-api-key": COINGECKO_API,
                            },
                        })];
                case 1:
                    metadataResponse = _a.sent();
                    if (!metadataResponse)
                        throw "[fetchTokenData] - Failed to get API response";
                    metadata = metadataResponse;
                    return [4 /*yield*/, getTokenHolderCountAndLaunchDate(address)];
                case 2:
                    holders = _a.sent();
                    return [4 /*yield*/, getTotalVolume(address, chain)];
                case 3:
                    totalVolume = _a.sent();
                    return [4 /*yield*/, getTransactionCount(address)];
                case 4:
                    trasanctionCount = _a.sent();
                    mintAddress = new web3_js_1.PublicKey(address);
                    return [4 /*yield*/, getLiquidity(address, "mainnet")];
                case 5:
                    liquidity = _a.sent();
                    result = {
                        address: address,
                        name: metadata.data.attributes.name,
                        symbol: metadata.data.attributes.symbol,
                        price: metadata.data.attributes.price_usd,
                        marketCap: metadata.data.attributes.market_cap_usd,
                        liquidity: liquidity,
                        holders: holders.holder,
                        volume: totalVolume,
                        transactions: trasanctionCount,
                        launchDate: new Date((holders === null || holders === void 0 ? void 0 : holders.created_time) * 1000).toLocaleDateString(),
                    };
                    // Write the result to output.json
                    fs_1.default.writeFileSync("SolOutput.json", JSON.stringify(result, null, 2));
                    return [2 /*return*/, result];
                case 6:
                    error_1 = _a.sent();
                    logger_js_1.logger.log("failed fetchTokenData: ".concat(error_1), "ERROR");
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 *  Function for getting the liquidity
 * @param address
 * @param network
 * @returns
 */
function getLiquidity(address, network) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_js_1.makeRequest)("https://solana-gateway.moralis.io/token/".concat(network, "/").concat(address, "/pairs/stats"), {
                            headers: {
                                "X-API-Key": MORALIS_API_KEY,
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response || !response.totalLiquidityUsd)
                        throw "failed API call";
                    logger_js_1.logger.log("success getLiquidity", "INFO");
                    return [2 /*return*/, response.totalLiquidityUsd];
                case 2:
                    error_2 = _a.sent();
                    logger_js_1.logger.log("failed getLiquidity: ".concat(error_2), "ERROR");
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * function to fetch total volume of the usd in different time frames
 * @param coinId
 * @param contractAddress
 * @param currency
 * @returns
 */
function getTotalVolume(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var response, results_1, getIndex, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_js_1.makeRequest)("https://pro-api.coingecko.com/api/v3/coins/".concat(chain, "/contract/").concat(address, "/market_chart?vs_currency=usd&days=").concat(30), {
                            headers: {
                                "x-cg-pro-api-key": COINGECKO_API,
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw "failed API call";
                    results_1 = response.total_volumes;
                    getIndex = function (hours) {
                        return Math.floor((hours / (30 * 24)) * results_1.length);
                    };
                    logger_js_1.logger.log("success getTotalVolume", "INFO");
                    return [2 /*return*/, {
                            "6h": results_1[getIndex(6)][1],
                            "12h": results_1[getIndex(12)][1],
                            "24h": results_1[getIndex(24)][1],
                            "48h": results_1[getIndex(48)][1],
                            "7d": results_1[getIndex(7 * 24)][1],
                            "30d": results_1[getIndex(30 * 24) - 1][1],
                        }];
                case 2:
                    error_3 = _a.sent();
                    logger_js_1.logger.log("failed getTotalVolume: ".concat(error_3), "ERROR");
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 *@returns transactionm in specific time of intervals
 * @param address
 * @param chain
 */
function getTransactionCount(address) {
    return __awaiter(this, void 0, void 0, function () {
        var timeFrames, results, _i, _a, _b, interval, since, till, query, response, trades, error_4;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    timeFrames = {
                        "6h": new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                        "12h": new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                        "24h": new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        "48h": new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                        "7d": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                        "30d": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    };
                    results = {};
                    _i = 0, _a = Object.entries(timeFrames);
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    _b = _a[_i], interval = _b[0], since = _b[1];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    till = new Date().toISOString();
                    query = JSON.stringify({
                        query: "{\n          Solana(network: solana) {\n            DEXTradeByTokens(\n              where: {\n                Trade: {\n                  Currency: {\n                    MintAddress: {\n                      is: \"".concat(address, "\"\n                    }\n                  }\n                },\n                Block: {\n                  Time: {\n                    since: \"").concat(since, "\",\n                    till: \"").concat(till, "\"\n                  }\n                },\n                Transaction: {\n                  Result: {\n                    Success: true\n                  }\n                }\n              }\n            ) {\n              trades: count\n              volume: sum(of: Trade_Amount)\n            }\n          }\n        }"),
                        variables: "",
                    });
                    logger_js_1.logger.log("Fetching transaction count for the ".concat(interval, " interval"), "INFO");
                    return [4 /*yield*/, (0, requestHandler_js_1.makeRequest)("https://streaming.bitquery.io/eap", {
                            method: "POST",
                            body: query,
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.BITQUERY_API_KEY),
                            },
                            redirect: "follow",
                        })];
                case 3:
                    response = _d.sent();
                    trades = ((_c = response.data.Solana.DEXTradeByTokens[0]) === null || _c === void 0 ? void 0 : _c.trades) || 0;
                    results[interval] = trades;
                    logger_js_1.logger.log("success getTransactionCount for ".concat(interval), "INFO");
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _d.sent();
                    logger_js_1.logger.log("failed getTransactionCount ".concat(interval, ": ").concat(error_4), "ERROR");
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, results];
            }
        });
    });
}
/**
 * Fetches token holder count from Solscan API.
 * @param address Token mint address.
 * @returns Holders count in different time intervals.
 */
function getTokenHolderCountAndLaunchDate(address) {
    return __awaiter(this, void 0, void 0, function () {
        var response, metadata, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_js_1.makeRequest)("https://pro-api.solscan.io/v2.0/token/meta?address=".concat(address), {
                            headers: {
                                accept: "application/json",
                                token: SOLSCAN_API_KEY,
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response || !response.data || response.data.length === 0) {
                        logger_js_1.logger.log("No holder data found.", "WARN");
                        return [2 /*return*/, null];
                    }
                    logger_js_1.logger.log("success getTokenHolderCountAndLaunchDate", "INFO");
                    metadata = response.data;
                    //return the metadata holder
                    return [2 /*return*/, metadata];
                case 2:
                    error_5 = _a.sent();
                    logger_js_1.logger.log("failed getTokenHolderCountAndLaunchDate: ".concat(error_5), "ERROR");
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
