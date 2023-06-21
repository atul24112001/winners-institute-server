import { Router } from 'express'
import { getAsset, getAssets, updateBanners, uploadImage } from '../controllers/adminController';
import multer from 'multer';
const adminRoutes = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

adminRoutes.get("/assets", getAssets);
adminRoutes.post("/upload", upload.single('file'), uploadImage);
adminRoutes.get("/assets/:id", getAsset);
adminRoutes.get("/assets/banner/:id", updateBanners);

export default adminRoutes;