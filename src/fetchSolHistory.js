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
exports.fetchHistoricalTokenData = fetchHistoricalTokenData;
var requestHandler_1 = require("./utils/requestHandler");
var logger_1 = require("./utils/logger");
var fs_1 = require("fs");
var dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
// API KEYS
var COINGECKO_API = process.env.COINGECKO_API_KEY;
var MORALIS_API_KEY = process.env.MORALIS_API_KEY2;
var BITQUERY_API_KEY = process.env.BITQUERY_API_KEY;
//
function fetchHistoricalTokenData(address, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var metadataResponse, metadata, coinId, historicalData, transactions, holders, result, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://pro-api.coingecko.com/api/v3/onchain/networks/".concat(chain, "/tokens/").concat(address), {
                            headers: { "x-cg-pro-api-key": COINGECKO_API },
                        })];
                case 1:
                    metadataResponse = _d.sent();
                    metadata = metadataResponse;
                    coinId = (_a = metadata.data) === null || _a === void 0 ? void 0 : _a.attributes.coingecko_coin_id;
                    return [4 /*yield*/, fetchHistoricalPriceData(coinId)];
                case 2:
                    historicalData = _d.sent();
                    return [4 /*yield*/, getTransactionCount(address)];
                case 3:
                    transactions = _d.sent();
                    return [4 /*yield*/, getTokenHolderCount(address)];
                case 4:
                    holders = _d.sent();
                    result = {
                        address: address,
                        name: (_b = metadata.data) === null || _b === void 0 ? void 0 : _b.attributes.name,
                        symbol: (_c = metadata.data) === null || _c === void 0 ? void 0 : _c.attributes.symbol,
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
                    fs_1.default.writeFileSync("HistoricalData.json", JSON.stringify(result, null, 2));
                    logger_1.logger.log("Succesfully written the output file", "INFO");
                    return [2 /*return*/, result];
                case 5:
                    error_1 = _d.sent();
                    logger_1.logger.log("Failed fetchHistoricalData: ".concat(error_1), "ERROR");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetch historical price and market cap data from CoinGecko.
 */
function fetchHistoricalPriceData(coinId) {
    return __awaiter(this, void 0, void 0, function () {
        var days_1, response, prices_1, marketCaps, volumes, getIndex, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    days_1 = 30;
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://pro-api.coingecko.com/api/v3/coins/".concat(coinId, "/market_chart?vs_currency=usd&days=").concat(days_1), {
                            headers: { "x-cg-pro-api-key": COINGECKO_API },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw "Failed API Call";
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
                    error_2 = _a.sent();
                    logger_1.logger.log("Failed fetchHistoricalPriceData: ".concat(error_2), "ERROR");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetch holders count for Solana or EVM.
 */
function getTokenHolderCount(address) {
    return __awaiter(this, void 0, void 0, function () {
        var timeFrames, results, _i, _a, _b, label, after, query, response, holdersCount, error_3;
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
                    _b = _a[_i], label = _b[0], after = _b[1];
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    query = JSON.stringify({
                        query: "{\n        Solana {\n          BalanceUpdates(\n            where: {\n              BalanceUpdate: {\n                PostBalance: {gt: \"0\"},\n                Currency: {\n                  MintAddress: {is: \"".concat(address, "\"}\n                }\n              }, \n              Block: {\n                Time: {after: \"").concat(after, "\"}\n              }\n            }\n          ) {\n            holders: count(distinct: BalanceUpdate_Account_Owner)\n          }\n        }\n      }\n    "),
                        variables: "",
                    });
                    logger_1.logger.log("Fetching transaction count for the ".concat(label, " interval"), "INFO");
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://streaming.bitquery.io/eap", {
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
                    if (!response)
                        throw "Failed api call";
                    holdersCount = ((_e = (_d = (_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.Solana) === null || _d === void 0 ? void 0 : _d.BalanceUpdates[0]) === null || _e === void 0 ? void 0 : _e.holders) || 0;
                    results[label] = holdersCount;
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _f.sent();
                    logger_1.logger.log("Failed getTokenHolderCount: ".concat(error_3), "ERROR");
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
 * Function for getting the transactions count
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
                        query: "{\n        Solana(network: solana) {\n          DEXTradeByTokens(\n            where: {\n              Trade: {\n                Currency: {\n                  MintAddress: {\n                    is: \"".concat(address, "\"\n                  }\n                }\n              },\n              Block: {\n                Time: {\n                  since: \"").concat(since, "\",\n                  till: \"").concat(till, "\"\n                }\n              },\n              Transaction: {\n                Result: {\n                  Success: true\n                }\n              }\n            }\n          ) {\n            trades: count\n            volume: sum(of: Trade_Amount)\n          }\n        }\n      }"),
                        variables: "",
                    });
                    logger_1.logger.log("Fetching transaction count for the ".concat(interval, " interval"), "INFO");
                    return [4 /*yield*/, (0, requestHandler_1.makeRequest)("https://streaming.bitquery.io/eap", {
                            method: "POST",
                            body: query,
                            redirect: "follow",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(BITQUERY_API_KEY),
                            },
                        })];
                case 3:
                    response = _d.sent();
                    trades = ((_c = response.data.Solana.DEXTradeByTokens[0]) === null || _c === void 0 ? void 0 : _c.trades) || 0;
                    results[interval] = trades;
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _d.sent();
                    logger_1.logger.log("Error fetching data for ".concat(interval, ":"), "ERROR");
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    logger_1.logger.log("This are the transaction counts ".concat(results.length), "INFO");
                    return [2 /*return*/, results];
            }
        });
    });
}
