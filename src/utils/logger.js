"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LoggerInstance_logFile;
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.logger = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var chalk_1 = require("chalk");
var __dirname = (0, url_1.fileURLToPath)(new URL('.', import.meta.url));
var logColors = {
    'ERROR': chalk_1.default.bold.red,
    'WARN': chalk_1.default.bold.yellow,
    'INFO': chalk_1.default.bold.hex('#00ffdd'),
    'DEBUG': chalk_1.default.bold.hex('#b7ff00'),
};
var LoggerInstance = /** @class */ (function () {
    // Create a log file  with the current date & time as the name
    function LoggerInstance() {
        _LoggerInstance_logFile.set(this, void 0);
        this.verboseLevel = 0;
        var now = new Date;
        var date = now.getDate().toString().padStart(2, '0');
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        var year = now.getFullYear().toString();
        var time = now.toTimeString().slice(0, 8).replaceAll(':', '_');
        var dir = (0, path_1.resolve)(__dirname, '../logs');
        // Get the absolute path & create file / dir
        __classPrivateFieldSet(this, _LoggerInstance_logFile, (0, path_1.resolve)(dir, "".concat(year, "_").concat(month, "_").concat(date, "_").concat(time, ".log")), "f");
        !fs_1.default.existsSync(dir) ? fs_1.default.mkdirSync(dir) : undefined;
        fs_1.default.writeFileSync(__classPrivateFieldGet(this, _LoggerInstance_logFile, "f"), '');
    }
    // Append time of message & write to file alongside writing to stdout
    LoggerInstance.prototype.log = function (any, level) {
        if (typeof any === 'object') {
            any = JSON.stringify(any);
        }
        else {
            any = any.toString();
        }
        var date = new Date;
        var text = "".concat(chalk_1.default.bold.white("[".concat(date.toTimeString().slice(0, 8), "]")), " ").concat(logColors[level]("[".concat(level, "] ").concat(any || 'undefined/null')));
        fs_1.default.appendFileSync(__classPrivateFieldGet(this, _LoggerInstance_logFile, "f"), text.replace(/\x1b\[[0-9;]*m/g, '') + '\n');
        if (level == 'ERROR' && this.verboseLevel < 0)
            return;
        if (level == 'WARN' && this.verboseLevel < 1)
            return;
        if (level == 'INFO' && this.verboseLevel < 2)
            return;
        if (level == 'DEBUG' && this.verboseLevel < 3)
            return;
        console.log(text);
    };
    return LoggerInstance;
}());
_LoggerInstance_logFile = new WeakMap();
var delay = function (ms) { return new Promise(function (r) { return setTimeout(r, ms); }); };
exports.delay = delay;
var logger = new LoggerInstance();
exports.logger = logger;
