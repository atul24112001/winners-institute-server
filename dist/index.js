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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./utils/database");
const master_routes_1 = __importDefault(require("./routes/master.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
require("dotenv").config({
    path: path_1.default.join(__dirname, `../.env.${process.env.NODE_ENV}`)
});
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    exposedHeaders: ["http://localhost:3000"]
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header({
        "Content-Type": "text/html"
    });
    res.send(`<h1 style="text-align: center;">Winner server up an running</h1>`);
}));
// api.use((error: ErrorRequestHandler, request: express.Request, response: express.Response, next: express.NextFunction) => {
//     response.status(500).end()
//   })
app.use("/api/master", master_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
const connectionString = process.env.DATABASE_CONNECTION_STRING;
if (typeof connectionString !== "string") {
    throw new Error("Connection string not provided.");
}
(0, database_1.mongoConnect)(() => {
    app.listen(PORT, () => {
        console.log("Server running on port: " + PORT);
    });
});
