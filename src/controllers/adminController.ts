import { Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import { collections, getDb } from "../utils/database";
import { ObjectId } from "mongodb";

export const uploadImage = async (req: Request, res: Response) => {
    const azureStorageConnectionString = process.env.CLOUD_CONNECTION_STRING;
    const containerName = process.env.CONTAINER;

    if (!req.file || typeof azureStorageConnectionString !== "string" || typeof containerName !== "string") {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const file = req.file;
        const blobName = `${Date.now()}-${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: {
                blobContentType: file.mimetype,
            },
        });

        const imageUrl = blockBlobClient.url;
        const db = await getDb();
        await db.collection(collections.ASSERTS).insertOne({
            type: "banner",
            url: imageUrl.slice(54)
        })
        return res.json({ message: 'File uploaded successfully' });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
                details: error.message
            })
        }
    }
}

export const getAssets = async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        const data = await db.collection(collections.ASSERTS).find({}).toArray();

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
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
                details: error.message
            })
        }
    }
}

export const updateBanners = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const db = await getDb();
        const liveBanners = await db.collection(collections.MASTER).findOne({
            name: "details"
        }).then((data) => {
            return data?.data.banners;
        });

        if (liveBanners && Array.isArray(liveBanners)) {
            const bannerIndex = liveBanners.findIndex(banner => String(banner.alt) === id);
            if (bannerIndex >= 0) {
                const updateBanners = liveBanners.filter(b => String(b.alt) !== id);
                const result = await db.collection(collections.MASTER).findOneAndUpdate({
                    name: "details"
                }, {
                    $set: {
                        "data.banners": updateBanners
                    }
                })
                console.log(result);
                return res.json({
                    message: "Banners Updated Successfully!"
                })
            } else {
                const targetBanner = await db.collection(collections.ASSERTS).findOne({
                    _id: new ObjectId(id)
                })
                if (targetBanner) {
                    const data = await db.collection(collections.MASTER).findOneAndUpdate({
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
                    })
                }

            }
        }
        res.status(400).json({
            message: "Something went wrong"
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
                details: error.message
            })
        }
    }
}

export const getAsset = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const db = await getDb();
        const image = await db.collection(collections.ASSERTS).findOne({
            _id: new ObjectId(id as string)
        });

        if (image) {
            const blobURL = process.env.ASSETS_URL + image.url;
            let img = Buffer.from(blobURL);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Length', img.length);
            res.status(200).end(img)
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.send(`<h1>No Image Found.</h1>`);
        }
    } catch (error) {

    }
}