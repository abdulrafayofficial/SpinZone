import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    carrier: {
      type: String,
      required: true,
      trim: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["processing", "shipped", "in_transit", "delivered", "returned"],
      default: "processing",
    },
    shippedAt: Date,
    estimatedDelivery: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Shipment", shipmentSchema);
