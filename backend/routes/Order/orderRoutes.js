import express from "express";
import { addOrder } from "../../controllers/Order/add_Order.js";

const router = express.Router();

router.post("/add_order", addOrder);

export default router;
