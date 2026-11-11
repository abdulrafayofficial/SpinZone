import Payment from "../../models/Payment.js";
import Order from "../../models/Order.js";
import { sendError } from "../../utils/sendError.js";

export const addPayment = async (req, res) => {
  try {
    const { order, user, amount, method, transactionId, status, paidAt } =
      req.body;

    if (!order || !user || amount === undefined) {
      return res.status(400).json({
        message: "Order, user, and amount are required",
      });
    }

    const orderRecord = await Order.findOne({ _id: order, user });

    if (!orderRecord) {
      return res.status(404).json({ message: "Order not found for this user" });
    }

    if (Number(amount) !== orderRecord.totalAmount) {
      return res.status(400).json({
        message: "Payment amount must match the order total",
      });
    }

    const parsedPaidAt = paidAt ? new Date(paidAt) : undefined;

    if (parsedPaidAt && Number.isNaN(parsedPaidAt.getTime())) {
      return res.status(400).json({ message: "Please provide a valid paid date" });
    }

    const payment = await Payment.create({
      order,
      user,
      amount,
      method,
      transactionId,
      status,
      paidAt: parsedPaidAt,
    });

    if (payment.status === "completed") {
      await Order.updateOne({ _id: order }, { paymentStatus: "paid" });
    } else if (payment.status === "pending") {
      await Order.updateOne({ _id: order }, { paymentStatus: "pending" });
    }

    return res.status(201).json({
      message: "Payment Created Successfully",
      payment,
    });
  } catch (error) {
    return sendError(res, error, "Add payment error");
  }
};
