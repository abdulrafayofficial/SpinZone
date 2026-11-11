import Category from "../../models/Category.js";
import { slugify } from "../../utils/slugify.js";
import { sendError } from "../../utils/sendError.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description, parent, image, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (parent) {
      const parentExist = await Category.exists({ _id: parent });

      if (!parentExist) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    const category = await Category.create({
      name,
      slug: slugify(name),
      description,
      parent,
      image,
      isActive,
    });

    return res.status(201).json({
      message: "Category Created Successfully",
      category,
    });
  } catch (error) {
    return sendError(res, error, "Add category error");
  }
};
