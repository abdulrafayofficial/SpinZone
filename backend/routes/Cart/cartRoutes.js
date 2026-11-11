import express from "express";
import { addCart } from "../../controllers/Cart/add_Cart.js";

const router = express.Router();

router.post("/add_cart", addCart);

export default router;
