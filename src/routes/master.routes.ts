import { Router } from "express";
import { getMasterData, updateDetails } from "../controllers/masterController";

const masterRoute = Router();

masterRoute.get("/data", getMasterData);
masterRoute.post("/data/details", updateDetails);

export default masterRoute;