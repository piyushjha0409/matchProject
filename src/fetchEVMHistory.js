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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalEVMTokenData = getHistoricalEVMTokenData;
var requestHandler_1 = require("./utils/requestHandler");
var logger_1 = require("./utils/logger");
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
(0, dotenv_1.configDotenv)();
var COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
var MORALIS_API_KEY = process.env.MORALIS_API_KEY;
var BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;
/**
 * Main Function
 * @param address
 * @param chain
 * @returns
 */
function getHistoricalEVMTokenData(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var metadataResponse, coinId, historicalData, holdersData, txCount, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://pro-api.coingecko.com/api/v3/onchain/networks/".concat(chain, "/tokens/").concat(address), {
                            method: "GET",
                            headers: {
                                "x-cg-pro-api-key": COINGECKO_API_KEY,
                            },
                        })];
                case 1:
                    metadataResponse = _a.sent();
                    if (!metadataResponse)
                        throw "Failed to fetch metadata of the token";
                    coinId = metadataResponse.data.attributes.coingecko_coin_id;
                    return [4 /*yield*/, fetchHistoricalPriceData(coinId)];
                case 2:
                    historicalData = _a.sent();
                    return [4 /*yield*/, getHoldersCount(address, chain)];
                case 3:
                    holdersData = _a.sent();
                    return [4 /*yield*/, getTransactionCount(address)];
                case 4:
                    txCount = _a.sent();
                    if (historicalData !== null && holdersData !== null) {
                        result = {
                            address: address,
                            name: metadataResponse.data.data.attributes.name,
                            symbol: metadataResponse.data.data.attributes.symbol,
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
                        fs_1.default.writeFileSync("HistoricalEVMToken.json", JSON.stringify(result, null, 2));
                        logger_1.logger.log("Successfully written a data into json file", "INFO");
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    logger_1.logger.log("Something went wrong with ".concat(err_1), "ERROR");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 *  This function is for fetching the details of the token
 * @param coinId
 * @returns
 */
function fetchHistoricalPriceData(coinId) {
    return __awaiter(this, void 0, void 0, function () {
        var days_1, response, prices_1, marketCaps, volumes, getIndex, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    days_1 = 30;
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://pro-api.coingecko.com/api/v3/coins/".concat(coinId, "/market_chart?vs_currency=usd&days=").concat(days_1), {
                            headers: { "x-cg-pro-api-key": COINGECKO_API_KEY },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw "Failed to call fetchHistoricalPriceData";
                    prices_1 = response.prices;
                    marketCaps = response.market_caps;
                    volumes = response.total_volumes;
                    getIndex = function (hours) {
                        return Math.floor((hours / (days_1 * 24)) * prices_1.length);
                    };
                    return [2 /*return*/, {
                            "6h": {
                                price: prices_1[getIndex(6)][1],
                                marketCap: marketCaps[getIndex(6)][1],
                                volume: volumes[getIndex(6)][1],
                            },
                            "12h": {
                                price: prices_1[getIndex(12)][1],
                                marketCap: marketCaps[getIndex(12)][1],
                                volume: volumes[getIndex(12)][1],
                            },
                            "24h": {
                                price: prices_1[getIndex(24)][1],
                                marketCap: marketCaps[getIndex(24)][1],
                                volume: volumes[getIndex(24)][1],
                            },
                            "48h": {
                                price: prices_1[getIndex(48)][1],
                                marketCap: marketCaps[getIndex(48)][1],
                                volume: volumes[getIndex(48)][1],
                            },
                            "7d": {
                                price: prices_1[getIndex(7 * 24)][1],
                                marketCap: marketCaps[getIndex(7 * 24)][1],
                                volume: volumes[getIndex(7 * 24)][1],
                            },
                            "30d": {
                                price: prices_1[getIndex(30 * 24) - 1][1], // Get last available data for 30d
                                marketCap: marketCaps[getIndex(30 * 24) - 1][1],
                                volume: volumes[getIndex(30 * 24) - 1][1],
                            },
                        }];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.log("Error fetching the Historical Data ".concat(error_1), "ERROR");
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Function for getting the holders count
 * @param address
 * @returns
 */
function getHoldersCount(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var fromDate, toDate, formatDate, allHoldersData, cursor, response, holdersData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    fromDate = new Date();
                    fromDate.setDate(fromDate.getDate() - 31);
                    toDate = new Date();
                    formatDate = function (date) {
                        return "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, "0"), "-").concat(String(date.getDate()).padStart(2, "0"));
                    };
                    allHoldersData = [];
                    cursor = null;
                    _a.label = 1;
                case 1: return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://deep-index.moralis.io/api/v2.2/erc20/".concat(address, "/holders/historical?chain=").concat(chain, "&fromDate=").concat(formatDate(fromDate), "&toDate=").concat(formatDate(toDate), "&timeFrame=1h&cursor=").concat(cursor), {
                        headers: {
                            "X-API-Key": MORALIS_API_KEY,
                        },
                    })];
                case 2:
                    response = _a.sent();
                    if (!response.data) {
                        logger_1.logger.log("Error fetching the holders count", "ERROR");
                    }
                    holdersData = response.data.result;
                    if (holdersData && holdersData.length > 0) {
                        allHoldersData = __spreadArray(__spreadArray([], allHoldersData, true), holdersData, true);
                    }
                    cursor = response.data.cursor; // Get next cursor
                    _a.label = 3;
                case 3:
                    if (cursor) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4:
                    console.log("Total holders data fetched:", allHoldersData.length);
                    if (allHoldersData.length === 0) {
                        console.warn("No holders data found.");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, processHoldersData(allHoldersData)];
                case 5:
                    error_2 = _a.sent();
                    console.error("Error fetching holders count:", error_2);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * For processing the holders data to the token
 * @param holdersData
 * @returns
 */
function processHoldersData(holdersData) {
    var now = Date.now();
    var timeFrames = {
        "6h": 6 * 60 * 60 * 1000,
        "12h": 12 * 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
        "48h": 48 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
    };
    var results = {};
    // Convert timestamps to milliseconds
    var holdersDataWithTimestamp = holdersData.map(function (_a) {
        var timestamp = _a.timestamp, totalHolders = _a.totalHolders;
        return ({
            timestamp: new Date(timestamp).getTime(),
            totalHolders: totalHolders,
        });
    });
    // Find closest holders count for each time frame
    Object.entries(timeFrames).forEach(function (_a) {
        var label = _a[0], duration = _a[1];
        var closestEntry = holdersDataWithTimestamp
            .filter(function (_a) {
            var timestamp = _a.timestamp;
            return now - timestamp >= duration;
        })
            .sort(function (a, b) { return b.timestamp - a.timestamp; })[0]; // Get closest past entry
        results[label] = closestEntry ? closestEntry.totalHolders : null;
    });
    console.log("Processed Holders Count for different time frames:", results.length);
    return results;
}
/**
 * function for getting the transaction count in specific time intervals
 * @param address
 * @param chain
 */
function getTransactionCount(address) {
    return __awaiter(this, void 0, void 0, function () {
        var timeFrames, results, _i, _a, _b, interval, since, till, query, response, trades, err_2;
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
                    query = "{\n        EVM(network: eth, dataset: combined) {\n          DEXTrades(\n            where: {Block: {Time: {since: \"".concat(since, "\", till: \"").concat(till, "\"}},\n              TransactionStatus: {Success: true},\n              Trade: {Buy: {Currency: {SmartContract: {is: \"").concat(address, "\"}}}}\n            }\n          ) {\n            trades: count\n          }\n        }\n      }");
                    console.log("Fetching the transactions count for the ".concat(interval, " interval"));
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://streaming.bitquery.io/graphql", {
                            method: "POST",
                            body: JSON.stringify({ query: query }),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(BITQUERY_API_KEY),
                            },
                            redirect: "follow",
                        })];
                case 3:
                    response = _d.sent();
                    if (!response.data) {
                        throw new Error("Invalid response for ".concat(interval));
                    }
                    trades = ((_c = response.data.EVM.DEXTrades[0]) === null || _c === void 0 ? void 0 : _c.trades) || 0;
                    results[interval] = trades;
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _d.sent();
                    logger_1.logger.log("This is the error ".concat(err_2), "ERROR");
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, results];
            }
        });
    });
}
