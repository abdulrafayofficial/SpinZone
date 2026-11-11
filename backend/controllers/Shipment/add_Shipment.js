import Shipment from "../../models/Shipment.js";
import Order from "../../models/Order.js";
import { sendError } from "../../utils/sendError.js";

const parseOptionalDate = (value) => (value ? new Date(value) : undefined);

export const addShipment = async (req, res) => {
  try {
    const {
      order,
      carrier,
      trackingNumber,
      status,
      shippedAt,
      estimatedDelivery,
      deliveredAt,
    } = req.body;

    if (!order || !carrier) {
      return res.status(400).json({
        message: "Order and carrier are required",
      });
    }

    const dates = {
      shippedAt: parseOptionalDate(shippedAt),
      estimatedDelivery: parseOptionalDate(estimatedDelivery),
      deliveredAt: parseOptionalDate(deliveredAt),
    };

    const hasInvalidDate = Object.values(dates).some(
      (date) => date && Number.isNaN(date.getTime()),
    );

    if (hasInvalidDate) {
      return res.status(400).json({ message: "Please provide valid dates" });
    }

    const orderExist = await Order.exists({ _id: order });

    if (!orderExist) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shipment = await Shipment.create({
      order,
      carrier,
      trackingNumber,
      status,
      ...dates,
    });

    const orderStatusMap = {
      shipped: "shipped",
      in_transit: "shipped",
      delivered: "delivered",
      returned: "returned",
    };

    if (orderStatusMap[shipment.status]) {
      await Order.updateOne(
        { _id: order },
        { status: orderStatusMap[shipment.status] },
      );
    }

    return res.status(201).json({
      message: "Shipment Created Successfully",
      shipment,
    });
  } catch (error) {
    return sendError(res, error, "Add shipment error");
  }
};
