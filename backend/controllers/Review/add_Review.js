import Review from "../../models/Review.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { sendError } from "../../utils/sendError.js";

export const addReview = async (req, res) => {
  try {
    const { product, user, rating, title, comment } = req.body;

    if (!product || !user || rating === undefined) {
      return res.status(400).json({
        message: "Product, user, and rating are required",
      });
    }

    const [productExist, userExist] = await Promise.all([
      Product.exists({ _id: product }),
      User.exists({ _id: user }),
    ]);

    if (!productExist) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const review = await Review.create({ product, user, rating, title, comment });

    const [summary] = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.updateOne(
      { _id: product },
      {
        ratingAverage: Math.round(summary.average * 10) / 10,
        ratingCount: summary.count,
      },
    );

    return res.status(201).json({
      message: "Review Created Successfully",
      review,
    });
  } catch (error) {
    return sendError(res, error, "Add review error");
  }
};
