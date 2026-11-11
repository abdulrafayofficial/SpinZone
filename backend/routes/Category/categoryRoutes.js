import express from "express";
import { addCategory } from "../../controllers/Category/add_Category.js";

const router = express.Router();

router.post("/add_category", addCategory);

export default router;
