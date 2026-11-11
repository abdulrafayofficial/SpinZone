import express from "express";
import { addProduct } from "../../controllers/Product/add_Product.js";

const router = express.Router();

router.post("/add_product", addProduct);

export default router;
