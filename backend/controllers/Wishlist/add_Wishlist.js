import Wishlist from "../../models/Wishlist.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { sendError } from "../../utils/sendError.js";

export const addWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;

    if (!user || !product) {
      return res.status(400).json({
        message: "User and product are required",
      });
    }

    const [userExist, productExist] = await Promise.all([
      User.exists({ _id: user }),
      Product.exists({ _id: product }),
    ]);

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!productExist) {
      return res.status(404).json({ message: "Product not found" });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user },
      { $addToSet: { products: product } },
      { upsert: true, returnDocument: "after" },
    );

    return res.status(201).json({
      message: "Product Added To Wishlist Successfully",
      wishlist,
    });
  } catch (error) {
    return sendError(res, error, "Add wishlist error");
  }
};
