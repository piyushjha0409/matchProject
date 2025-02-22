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
exports.fetchRealTimeTokenDataOnEVM = fetchRealTimeTokenDataOnEVM;
var fs_1 = require("fs");
var requestHandler_1 = require("./utils/requestHandler");
var logger_1 = require("./utils/logger");
var dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
// Configuration
var MORALIS_API_KEY = process.env.MORALIS_API_KEY;
var COINGECKO_API = process.env.COINGECKO_API_KEY;
var BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;
/**
 * Fetch real-time token data using Moralis API
 * @param {string} address - Token contract address
 * @param {string} chain - Blockchain identifier ('eth', 'solana', etc.)
 */
function fetchRealTimeTokenDataOnEVM(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenData, tokenPrice, totalLiquidity, holdersData, totalVolume, transactionCount, result, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, fetchTokenDetails(address, chain)];
                case 1:
                    tokenData = _e.sent();
                    return [4 /*yield*/, getTokenPrice(address, chain)];
                case 2:
                    tokenPrice = _e.sent();
                    return [4 /*yield*/, getLiquidity(address, chain)];
                case 3:
                    totalLiquidity = _e.sent();
                    return [4 /*yield*/, getHoldersData(address, chain)];
                case 4:
                    holdersData = _e.sent();
                    return [4 /*yield*/, getTotalVolume(address, chain)];
                case 5:
                    totalVolume = _e.sent();
                    return [4 /*yield*/, getTransactionCount(address, chain)];
                case 6:
                    transactionCount = _e.sent();
                    result = {
                        address: address,
                        name: (_a = tokenData[0]) === null || _a === void 0 ? void 0 : _a.name,
                        symbol: (_b = tokenData[0]) === null || _b === void 0 ? void 0 : _b.symbol,
                        price: tokenPrice,
                        marketCap: (_c = tokenData[0]) === null || _c === void 0 ? void 0 : _c.market_cap,
                        liquidity: totalLiquidity,
                        volume: totalVolume,
                        transactions: transactionCount,
                        holders: holdersData === null || holdersData === void 0 ? void 0 : holdersData.totalHolders,
                        launchDate: (_d = tokenData[0]) === null || _d === void 0 ? void 0 : _d.created_at,
                    };
                    //write the tokenData to the output2.json
                    fs_1.default.writeFileSync("EVMToken.json", JSON.stringify(result, null, 2));
                    logger_1.logger.log("Data written to EVMToken.json", "INFO");
                    return [2 /*return*/, result];
                case 7:
                    error_1 = _e.sent();
                    console.error("Error fetching token data:", error_1);
                    throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetch liquidity, volume, and live price using Moralis API
 */
function fetchTokenDetails(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=".concat(chain, "&addresses=").concat(address), {
                            headers: {
                                "Content-Type": "application/json",
                                "X-API-Key": MORALIS_API_KEY,
                            },
                            redirect: "follow",
                        })];
                case 1:
                    response = _a.sent();
                    logger_1.logger.log("This is the response ".concat(response.data), "INFO");
                    if (!response) {
                        throw "Failed to call fetchTokenDetails";
                    }
                    return [2 /*return*/, response];
                case 2:
                    error_2 = _a.sent();
                    logger_1.logger.log("failed fetchTokenDetails: ".concat(error_2), "ERROR");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Function for getting the real time liquidity of an EVM token
 * @param address
 * @param chain
 */
function getLiquidity(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://deep-index.moralis.io/api/v2.2/erc20/".concat(address, "/pairs/stats?chain=").concat(chain), {
                            headers: {
                                "Content-Type": "application/json",
                                "X-API-Key": MORALIS_API_KEY,
                            },
                            redirect: "follow",
                        })];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw "Failed to call get holders";
                    return [2 /*return*/, response.total_liquidity_usd];
                case 2:
                    error_3 = _a.sent();
                    logger_1.logger.log("Failed getLIquidity function ".concat(error_3), "ERROR");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 *  Function to get the price
 * @param address
 * @param chain
 */
function getTokenPrice(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://deep-index.moralis.io/api/v2.2/erc20/".concat(address, "/price?chain=").concat(chain), {
                            headers: {
                                "X-Api-Key": MORALIS_API_KEY,
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw "Failed to call get Price";
                    return [2 /*return*/, response.usdPrice];
                case 2:
                    err_1 = _a.sent();
                    logger_1.logger.log("Error fetching the price of the token", "ERROR");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetch EVM-specific data (holder count, launch date placeholder)?
 * @param {string} address - Token contract address
 * @returns market cap, holders count, and launch date for EVM tokens
 */
function getHoldersData(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenHolders, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://deep-index.moralis.io/api/v2.2/erc20/".concat(address, "/holders?chain=").concat(chain), {
                            headers: {
                                "X-API-Key": MORALIS_API_KEY,
                            },
                        })];
                case 1:
                    tokenHolders = _a.sent();
                    if (!tokenHolders) {
                        throw "Failed to call the get Holders API call";
                    }
                    console.log("Holders data", tokenHolders);
                    return [2 /*return*/, tokenHolders];
                case 2:
                    error_4 = _a.sent();
                    logger_1.logger.log("failed getHoldersData: ".concat(error_4), "ERROR");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 *  function for getting the volume in time formats
 * @param address
 * @param chain
 * @returns
 */
function getTotalVolume(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var response, results_1, getIndex, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://pro-api.coingecko.com/api/v3/coins/".concat(chain, "/contract/").concat(address, "/market_chart?vs_currency=usd&days=").concat(30), {
                            headers: {
                                "x-cg-pro-api-key": COINGECKO_API,
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response) {
                        throw "Failed to call get total volume";
                    }
                    results_1 = response.total_volumes;
                    getIndex = function (hours) {
                        return Math.floor((hours / (30 * 24)) * results_1.length);
                    };
                    return [2 /*return*/, {
                            "6h": results_1[getIndex(6)][1],
                            "12h": results_1[getIndex(12)][1],
                            "24h": results_1[getIndex(24)][1],
                            "48h": results_1[getIndex(48)][1],
                            "7d": results_1[getIndex(7 * 24)][1],
                            "30d": results_1[getIndex(30 * 24) - 1][1],
                        }];
                case 2:
                    error_5 = _a.sent();
                    logger_1.logger.log("failed getTotalVolume: ".concat(error_5), "ERROR");
                    return [3 /*break*/, 3];
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
function getTransactionCount(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var timeFrames, results, _i, _a, _b, interval, since, till, query, response, trades, err_2;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
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
                    _f.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    _b = _a[_i], interval = _b[0], since = _b[1];
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    till = new Date().toISOString();
                    query = JSON.stringify({
                        query: "{\n          EVM(network: ".concat(chain, ", dataset: combined) {\n            DEXTrades(\n              where: {Block: {Time: {since: \"").concat(since, "\", till: \"").concat(till, "\"}},\n                TransactionStatus: {Success: true},\n                Trade: {Buy: {Currency: {SmartContract: {is: \"").concat(address, "\"}}}}\n              }\n            ) {\n              trades: count\n            }\n          }\n        }"),
                        variables: "",
                    });
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://streaming.bitquery.io/graphql", {
                            method: "POST",
                            body: query,
                            redirect: "follow",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(BITQUERY_API_KEY),
                            },
                        })];
                case 3:
                    response = _f.sent();
                    if (!response.data) {
                        throw "Invalid response for ".concat(interval);
                    }
                    logger_1.logger.log("This is the response for transaction count ".concat(JSON.stringify(response.data)), "INFO");
                    trades = ((_e = (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.EVM) === null || _d === void 0 ? void 0 : _d.DEXTrades[0]) === null || _e === void 0 ? void 0 : _e.trades) || 0;
                    results[interval] = trades;
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _f.sent();
                    logger_1.logger.log("failed getTransactionCount: ".concat(err_2), "ERROR");
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, results];
            }
        });
    });
}
