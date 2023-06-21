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
exports.getAsset = exports.updateBanners = exports.getAssets = exports.uploadImage = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const database_1 = require("../utils/database");
const mongodb_1 = require("mongodb");
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const azureStorageConnectionString = process.env.CLOUD_CONNECTION_STRING;
    const containerName = process.env.CONTAINER;
    if (!req.file || typeof azureStorageConnectionString !== "string" || typeof containerName !== "string") {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(azureStorageConnectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const file = req.file;
        const blobName = `${Date.now()}-${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        yield blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: {
                blobContentType: file.mimetype,
            },
        });
        const imageUrl = blockBlobClient.url;
        const db = yield (0, database_1.getDb)();
        yield db.collection(database_1.collections.ASSERTS).insertOne({
            type: "banner",
            url: imageUrl.slice(54)
        });
        return res.json({ message: 'File uploaded successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
                details: error.message
            });
        }
    }
});
exports.uploadImage = uploadImage;
const getAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.getDb)();
        const data = yield db.collection(database_1.collections.ASSERTS).find({}).toArray();
        const banners = [];
        for (let asset of data) {
            if (asset.type === "banner") {
                banners.push({
                    url: process.env.ASSETS_URL + asset.url,
                    alt: asset._id
                });
            }
        }
        return res.json({
            banners,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
                details: error.message
            });
        }
    }
});
exports.getAssets = getAssets;
const updateBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const db = yield (0, database_1.getDb)();
        const liveBanners = yield db.collection(database_1.collections.MASTER).findOne({
            name: "details"
        }).then((data) => {
            return data === null || data === void 0 ? void 0 : data.data.banners;
        });
        if (liveBanners && Array.isArray(liveBanners)) {
            const bannerIndex = liveBanners.findIndex(banner => String(banner.alt) === id);
            if (bannerIndex >= 0) {
                const updateBanners = liveBanners.filter(b => String(b.alt) !== id);
                const result = yield db.collection(database_1.collections.MASTER).findOneAndUpdate({
                    name: "details"
                }, {
                    $set: {
                        "data.banners": updateBanners
                    }
                });
                console.log(result);
                return res.json({
                    message: "Banners Updated Successfully!"
                });
            }
            else {
                const targetBanner = yield db.collection(database_1.collections.ASSERTS).findOne({
                    _id: new mongodb_1.ObjectId(id)
                });
                if (targetBanner) {
                    const data = yield db.collection(database_1.collections.MASTER).findOneAndUpdate({
                        name: "details"
                    }, {
                        $set: {
                            "data.banners": [...liveBanners, {
                                    alt: targetBanner._id,
                                    src: process.env.ASSETS_URL + targetBanner.url
                                }]
                        }
                    });
                    return res.json({
                        message: "Banners Updated Successfully."
                    });
                }
            }
        }
        res.status(400).json({
            message: "Something went wrong"
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
                details: error.message
            });
        }
    }
});
exports.updateBanners = updateBanners;
const getAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const db = yield (0, database_1.getDb)();
        const image = yield db.collection(database_1.collections.ASSERTS).findOne({
            _id: new mongodb_1.ObjectId(id)
        });
        if (image) {
            const blobURL = process.env.ASSETS_URL + image.url;
            let img = Buffer.from(blobURL);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Length', img.length);
            res.status(200).end(img);
        }
        else {
            res.setHeader('Content-Type', 'text/html');
            res.send(`<h1>No Image Found.</h1>`);
        }
    }
    catch (error) {
    }
});
exports.getAsset = getAsset;
