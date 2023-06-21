"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const masterController_1 = require("../controllers/masterController");
const masterRoute = (0, express_1.Router)();
masterRoute.get("/data", masterController_1.getMasterData);
masterRoute.post("/data/details", masterController_1.updateDetails);
exports.default = masterRoute;
