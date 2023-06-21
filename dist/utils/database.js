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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.getDb = exports.collections = exports.mongoConnect = void 0;
const mongodb_1 = require("mongodb");
let _client = null;
let _db = null;
const mongoConnect = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    const url = process.env.DATABASE_CONNECTION_STRING;
    if (typeof url === "string") {
        try {
            _client = yield mongodb_1.MongoClient.connect(url);
            _db = _client.db("winners_institute");
            console.log("connected!");
            callback();
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.mongoConnect = mongoConnect;
exports.collections = {
    MASTER: "master_data",
    ASSERTS: "winners_assets"
};
const getDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (_db) {
        return _db;
    }
    else {
        throw new Error("_db not found!, connection error.");
    }
});
exports.getDb = getDb;
const getClient = () => __awaiter(void 0, void 0, void 0, function* () {
    if (_client) {
        return _client;
    }
    else {
        throw new Error("_client not found!, connection error.");
    }
});
exports.getClient = getClient;
