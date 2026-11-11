import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";
import authRoute from "./routes/Auth/authRoutes.js";
import addressRoute from "./routes/Address/addressRoutes.js";
import categoryRoute from "./routes/Category/categoryRoutes.js";
import brandRoute from "./routes/Brand/brandRoutes.js";
import productRoute from "./routes/Product/productRoutes.js";
import cartRoute from "./routes/Cart/cartRoutes.js";
import wishlistRoute from "./routes/Wishlist/wishlistRoutes.js";
import couponRoute from "./routes/Coupon/couponRoutes.js";
import orderRoute from "./routes/Order/orderRoutes.js";
import paymentRoute from "./routes/Payment/paymentRoutes.js";
import shipmentRoute from "./routes/Shipment/shipmentRoutes.js";
import reviewRoute from "./routes/Review/reviewRoutes.js";

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/address", addressRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/shipment", shipmentRoute);
app.use("/api/review", reviewRoute);

app.get("/", (req, res) => res.status(200).send("Welcome to SpinZone API"));

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
