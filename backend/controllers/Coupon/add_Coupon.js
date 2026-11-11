import Coupon from "../../models/Coupon.js";
import { sendError } from "../../utils/sendError.js";

export const addCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      isActive,
    } = req.body;

    if (
      !code ||
      !discountType ||
      discountValue === undefined ||
      !validFrom ||
      !validUntil
    ) {
      return res.status(400).json({
        message:
          "Code, discount type, discount value, valid from, and valid until are required",
      });
    }

    const parsedValidFrom = new Date(validFrom);
    const parsedValidUntil = new Date(validUntil);

    if (
      Number.isNaN(parsedValidFrom.getTime()) ||
      Number.isNaN(parsedValidUntil.getTime()) ||
      parsedValidUntil <= parsedValidFrom
    ) {
      return res.status(400).json({
        message: "Please provide a valid date range",
      });
    }

    if (discountType === "percentage" && discountValue > 100) {
      return res.status(400).json({
        message: "Percentage discount cannot exceed 100",
      });
    }

    const coupon = await Coupon.create({
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom: parsedValidFrom,
      validUntil: parsedValidUntil,
      isActive,
    });

    return res.status(201).json({
      message: "Coupon Created Successfully",
      coupon,
    });
  } catch (error) {
    return sendError(res, error, "Add coupon error");
  }
};
