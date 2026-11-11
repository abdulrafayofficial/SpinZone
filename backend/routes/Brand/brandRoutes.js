import express from "express";
import { addBrand } from "../../controllers/Brand/add_Brand.js";

const router = express.Router();

router.post("/add_brand", addBrand);

export default router;
