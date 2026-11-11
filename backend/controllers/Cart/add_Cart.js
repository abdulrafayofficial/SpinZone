import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { sendError } from "../../utils/sendError.js";

export const addCart = async (req, res) => {
  try {
    const { user, items } = req.body;

    if (!user || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "User and at least one cart item are required",
      });
    }

    const userExist = await User.exists({ _id: user });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const products = await Product.find({
      _id: { $in: items.map((item) => item.product) },
      status: "active",
    });

    const productMap = new Map(
      products.map((product) => [String(product._id), product]),
    );

    const cartItems = [];

    for (const item of items) {
      const product = productMap.get(String(item.product));
      const quantity = Number(item.quantity);

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.product} is unavailable`,
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Quantity must be a positive whole number",
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} unit(s) of ${product.name} in stock`,
        });
      }

      cartItems.push({
        product: product._id,
        quantity,
        price: product.discountPrice ?? product.price,
      });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const cart = await Cart.findOneAndUpdate(
      { user },
      { items: cartItems, totalAmount },
      { upsert: true, returnDocument: "after", runValidators: true },
    );

    return res.status(201).json({
      message: "Cart Saved Successfully",
      cart,
    });
  } catch (error) {
    return sendError(res, error, "Add cart error");
  }
};
