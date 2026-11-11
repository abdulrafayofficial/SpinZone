import express from "express";
import { addAddress } from "../../controllers/Address/add_Address.js";

const router = express.Router();

router.post("/add_address", addAddress);

export default router;
