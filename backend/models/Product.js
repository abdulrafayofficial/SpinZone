import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    productType: {
      type: String,
      enum: [
        "blade",
        "rubber",
        "ready_racket",
        "ball",
        "table",
        "net_set",
        "robot",
        "shoes",
        "apparel",
        "accessory",
      ],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: [String],
    specifications: {
      speed: { type: Number, min: 0, max: 100 },
      spin: { type: Number, min: 0, max: 100 },
      control: { type: Number, min: 0, max: 100 },
      weightGrams: { type: Number, min: 0 },
      plies: { type: Number, min: 1 },
      thicknessMm: { type: Number, min: 0 },
      hardness: { type: String, trim: true },
      color: { type: String, trim: true },
      size: { type: String, trim: true },
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "draft", "discontinued"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
