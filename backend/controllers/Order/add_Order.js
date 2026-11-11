import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Address from "../../models/Address.js";
import Coupon from "../../models/Coupon.js";
import User from "../../models/User.js";
import { generateOrderNumber } from "../../utils/generateOrderNumber.js";
import { sendError } from "../../utils/sendError.js";

const calculateDiscount = (coupon, subtotal) => {
  let discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscountAmount !== undefined && coupon.maxDiscountAmount !== null) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  return Math.min(discount, subtotal);
};

export const addOrder = async (req, res) => {
  try {
    const { user, items, shippingAddress, couponCode, shippingFee } = req.body;

    if (!user || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "User, shipping address, and at least one item are required",
      });
    }

    const fee = shippingFee === undefined ? 0 : Number(shippingFee);

    if (Number.isNaN(fee) || fee < 0) {
      return res.status(400).json({ message: "Invalid shipping fee" });
    }

    const [userExist, addressExist] = await Promise.all([
      User.exists({ _id: user }),
      Address.exists({ _id: shippingAddress, user }),
    ]);

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!addressExist) {
      return res.status(404).json({
        message: "Shipping address not found for this user",
      });
    }

    const products = await Product.find({
      _id: { $in: items.map((item) => item.product) },
      status: "active",
    });

    const productMap = new Map(
      products.map((product) => [String(product._id), product]),
    );

    const orderItems = [];

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

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.discountPrice ?? product.price,
        quantity,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let coupon = null;
    let discountAmount = 0;

    if (couponCode) {
      const now = new Date();

      coupon = await Coupon.findOne({
        code: String(couponCode).toUpperCase(),
        isActive: true,
        validFrom: { $lte: now },
        validUntil: { $gte: now },
      });

      if (!coupon) {
        return res.status(400).json({ message: "Coupon is invalid or expired" });
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }

      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}`,
        });
      }

      discountAmount = calculateDiscount(coupon, subtotal);
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user,
      items: orderItems,
      shippingAddress,
      coupon: coupon ? coupon._id : undefined,
      subtotal,
      shippingFee: fee,
      discountAmount,
      totalAmount: subtotal - discountAmount + fee,
    });

    await Product.bulkWrite(
      orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: -item.quantity } },
        },
      })),
    );

    if (coupon) {
      await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
    }

    return res.status(201).json({
      message: "Order Created Successfully",
      order,
    });
  } catch (error) {
    return sendError(res, error, "Add order error");
  }
};
