import Address from "../../models/Address.js";
import User from "../../models/User.js";
import { sendError } from "../../utils/sendError.js";

export const addAddress = async (req, res) => {
  try {
    const {
      user,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (!user || !fullName || !phone || !addressLine1 || !city) {
      return res.status(400).json({
        message: "User, full name, phone, address line 1, and city are required",
      });
    }

    const userExist = await User.exists({ _id: user });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isDefault) {
      await Address.updateMany({ user }, { isDefault: false });
    }

    const address = await Address.create({
      user,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    return res.status(201).json({
      message: "Address Created Successfully",
      address,
    });
  } catch (error) {
    return sendError(res, error, "Add address error");
  }
};
