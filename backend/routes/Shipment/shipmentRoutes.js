import express from "express";
import { addShipment } from "../../controllers/Shipment/add_Shipment.js";

const router = express.Router();

router.post("/add_shipment", addShipment);

export default router;
