import express from "express";
import { addWishlist } from "../../controllers/Wishlist/add_Wishlist.js";

const router = express.Router();

router.post("/add_wishlist", addWishlist);

export default router;
