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
exports.updateDetails = exports.getMasterData = void 0;
const database_1 = require("../utils/database");
const getMasterData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.getDb)();
        const data = yield db.collection(database_1.collections.MASTER).find({}).toArray();
        const dataObj = {};
        for (let obj of data) {
            dataObj[obj.name] = obj.data;
        }
        res.json(dataObj);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error.",
                description: error.message,
            });
        }
    }
});
exports.getMasterData = getMasterData;
const updateDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Object.keys(req.body).reduce((prev, current) => {
            prev["data." + current] = req.body[current];
            return prev;
        }, {});
        const db = yield (0, database_1.getDb)();
        yield db.collection(database_1.collections.MASTER).findOneAndUpdate({
            name: "details"
        }, {
            $set: data
        });
        console.log(data);
        res.json({
            message: "Details Updated Successfully!"
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error.",
                description: error.message,
            });
        }
    }
});
exports.updateDetails = updateDetails;
