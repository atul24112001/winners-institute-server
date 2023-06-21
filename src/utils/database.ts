import { Db, MongoClient } from "mongodb"

let _client: null | MongoClient = null;
let _db: null | Db = null;

export const mongoConnect = async (callback: CallableFunction) => {
    const url = process.env.DATABASE_CONNECTION_STRING;
    console.log("DATABASE_CONNECTION_STRING", url);
    if (typeof url === "string") {
        await MongoClient.connect(url).then(client => {
            _client = client;
            _db = client.db("winners_institute")
            console.log("connected!");
            callback();
        }).catch(error => {
            console.log(error)
        });

    }
}

export const collections = {
    MASTER: "master_data",
    ASSERTS: "winners_assets"
}

export const getDb = async () => {
    if (_db) {
        return _db;
    } else {
        throw new Error("_db not found!, connection error.")
    }
}

export const getClient = async () => {
    if (_client) {
        return _client;
    } else {
        throw new Error("_client not found!, connection error.")
    }
}