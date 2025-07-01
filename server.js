const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const Razorpay = require("razorpay");
const OrderSchema = require("./models/OrderSchema");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/subcategories", require("./routes/subcategory"));
app.use("/api/plans", require("./routes/plan"));
app.use("/api/supercoins", require("./routes/supercoin"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/addresses", require("./routes/address"));
app.use("/api/subscriptions", require("./routes/subscription"));
// app.js
app.use("/api/payment", require("./routes/payment"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/doctors", require("./routes/doctor-profile"));
app.use("/api/health-checks", require("./routes/healthCheck.routes"));
app.use("/api/lab-tests", require("./routes/labTest.routes"));
app.use("/api/medicines", require("./routes/medicines"));
app.use("/api/grocery/categories", require("./routes/groceryCategoryRoutes"));
app.use(
  "/api/grocery/subcategories",
  require("./routes/grocerySubcategoryRoutes")
);

app.use("/api/grocery/products", require("./routes/groceryProductRoutes"));
app.use("/api/fruits-vegetables", require("./routes/fruitsVegRoutes"));
app.use("/api/milk", require("./routes/milkcategory"));
app.use("/api/milk-products", require("./routes/milkProduct.routes"));
app.use("/api/book-slot", require("./routes/appointment"));
// app.use( departmentRoutes);

app.post("/api/payment/order", authMiddleware, async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { amount, products } = req.body;

  if (!userId || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "userId and products are required." });
  }

  const options = {
    amount: Number(amount * 100), // Convert to paise
    currency: "INR",
    receipt: `order_rcptid_${Date.now()}`,
    notes: {
      userId,
      products: JSON.stringify(products),
    },
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    console.log(products);
    // Format products to match schema
    const formattedProducts = products.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
      priceAtPurchase: p.priceAtPurchase, // Make sure this is provided in frontend
    }));

    console.log(formattedProducts);
    // Save to DB
    const order = new OrderSchema({
      userId,
      products: formattedProducts,
      totalAmount: amount,
      // status is "pending" by default
      // paymentId will be updated after payment is captured
    });

    await order.save();

    res.json({
      razorpayOrder,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify payment signature (optional but recommended)
app.post("/api/payment/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", "YOUR_KEY_SECRET")
    .update(body.toString())
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (isValid) {
    res.json({ status: "Payment verified" });
  } else {
    res.status(400).json({ status: "Invalid signature" });
  }
});

const PORT = process.env.PORT || 5000;

app.get("/", (req,res)=>{
  res.send("Homepage")
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
