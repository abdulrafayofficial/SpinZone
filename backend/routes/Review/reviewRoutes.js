import express from "express";
import { addReview } from "../../controllers/Review/add_Review.js";

const router = express.Router();

router.post("/add_review", addReview);

export default router;
