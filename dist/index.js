"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPCServer = exports.IPCClient = void 0;
const IPCClient_1 = __importDefault(require("./IPCClient"));
exports.IPCClient = IPCClient_1.default;
const IPCServer_1 = __importDefault(require("./IPCServer"));
exports.IPCServer = IPCServer_1.default;
