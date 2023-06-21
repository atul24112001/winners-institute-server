"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const multer_1 = __importDefault(require("multer"));
const adminRoutes = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
adminRoutes.get("/assets", adminController_1.getAssets);
adminRoutes.post("/upload", upload.single('file'), adminController_1.uploadImage);
adminRoutes.get("/assets/:id", adminController_1.getAsset);
adminRoutes.get("/assets/banner/:id", adminController_1.updateBanners);
exports.default = adminRoutes;
