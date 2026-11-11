import express from "express";
import { addCoupon } from "../../controllers/Coupon/add_Coupon.js";

const router = express.Router();

router.post("/add_coupon", addCoupon);

export default router;
