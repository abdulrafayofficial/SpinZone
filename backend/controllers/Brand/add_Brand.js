import Brand from "../../models/Brand.js";
import { slugify } from "../../utils/slugify.js";
import { sendError } from "../../utils/sendError.js";

export const addBrand = async (req, res) => {
  try {
    const { name, country, description, logo, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const brand = await Brand.create({
      name,
      slug: slugify(name),
      country,
      description,
      logo,
      isActive,
    });

    return res.status(201).json({
      message: "Brand Created Successfully",
      brand,
    });
  } catch (error) {
    return sendError(res, error, "Add brand error");
  }
};
