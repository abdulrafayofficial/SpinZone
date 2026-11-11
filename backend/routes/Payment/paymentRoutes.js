import express from "express";
import { addPayment } from "../../controllers/Payment/add_Payment.js";

const router = express.Router();

router.post("/add_payment", addPayment);

export default router;
