import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Brand from "../../models/Brand.js";
import { slugify } from "../../utils/slugify.js";
import { sendError } from "../../utils/sendError.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      productType,
      category,
      brand,
      description,
      price,
      discountPrice,
      stock,
      images,
      specifications,
      isFeatured,
      status,
    } = req.body;

    if (
      !name ||
      !sku ||
      !productType ||
      !category ||
      !brand ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          "Name, SKU, product type, category, brand, and price are required",
      });
    }

    if (discountPrice !== undefined && discountPrice > price) {
      return res.status(400).json({
        message: "Discount price cannot exceed the regular price",
      });
    }

    const [categoryExist, brandExist] = await Promise.all([
      Category.exists({ _id: category }),
      Brand.exists({ _id: brand }),
    ]);

    if (!categoryExist) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!brandExist) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const product = await Product.create({
      name,
      slug: slugify(`${name}-${sku}`),
      sku,
      productType,
      category,
      brand,
      description,
      price,
      discountPrice,
      stock,
      images,
      specifications,
      isFeatured,
      status,
    });

    return res.status(201).json({
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    return sendError(res, error, "Add product error");
  }
};
