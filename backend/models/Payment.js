import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: [
        "cash_on_delivery",
        "card",
        "jazzcash",
        "easypaisa",
        "bank_transfer",
      ],
      default: "cash_on_delivery",
    },
    transactionId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paidAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Payment", paymentSchema);
