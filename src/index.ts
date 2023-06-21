import express, { ErrorRequestHandler, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { mongoConnect } from "./utils/database";
import masterRoute from "./routes/master.routes";
import adminRoutes from "./routes/admin.routes";

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(morgan("dev"))
app.use(cors({
    exposedHeaders: ["http://localhost:3000"]
}));
app.use(express.json({ limit: "10mb" }))

app.get("/", async (req: Request, res: Response) => {
    res.header({
        "Content-Type": "text/html"
    })
    res.send(`<h1 style="text-align: center;">Winner server up an running</h1>`)
})

app.use("/api/master", masterRoute);
app.use("/api/admin", adminRoutes);

const connectionString = process.env.DATABASE_CONNECTION_STRING;

if (typeof connectionString !== "string") {
    throw new Error("Connection string not provided.")
}


app.listen(PORT, () => {
    console.log("App started")
    mongoConnect(() => {
        console.log("Server running on port: " + PORT);
    })
})