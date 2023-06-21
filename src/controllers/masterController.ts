import { Request, Response } from "express";
import { collections, getDb } from "../utils/database";

export const getMasterData = async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        const data = await db.collection(collections.MASTER).find({}).toArray();
        const dataObj: { [key: string]: any } = {};
        for (let obj of data) {
            dataObj[obj.name] = obj.data;
        }
        res.json(dataObj)
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error.",
                description: error.message,
            })
        }
    }
}

export const updateDetails = async (req: Request, res: Response) => {

    try {
        const data = await Object.keys(req.body).reduce((prev: any, current) => {
            prev["data." + current] = req.body[current];
            return prev;
        }, {});
        const db = await getDb();
        await db.collection(collections.MASTER).findOneAndUpdate({
            name: "details"
        }, {
            $set: data
        })
        console.log(data);
        res.json({
            message: "Details Updated Successfully!"
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error.",
                description: error.message,
            })
        }
    }
}