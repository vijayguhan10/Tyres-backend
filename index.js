const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ConnectDb = require("./Config/Connect");
const userRoutes = require("./router/User.route");
const AddressRoutes = require("./router/Address.route");
const OrderTyres_clients = require("./router/client/Index.route");
const AdminRouter = require("./router/admin/Index.route");
const ShopRouter = require("./router/shop/Index.route");
const carwashRoutes = require("./router/carwash/Index.route");
const communicateRoutes = require("./router/communication/communicate.route");
const morgan = require("morgan");
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://revozen-partner.vercel.app",
      "https://revozen-admin1.vercel.app",
      "https://revozen-carwash.vercel.app",
      "http://alb-673665962.ap-south-1.elb.amazonaws.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["set-cookie"],

    allowedHeaders: ["Content-Type", "Authorization", "x-app-type"],
    exposedHeaders: ["set-cookie"],
  })
);
app.get("/awshelath", (req, res) => {
  res.status(200).send("<h1>Aws Health Check</h1>");
});
// console.log("h1");
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/address", AddressRoutes);
app.use("/api/client", OrderTyres_clients);
app.use("/api/admin", AdminRouter);
app.use("/api", ShopRouter);
app.use("/api", carwashRoutes);
app.use("/api/communication", communicateRoutes);
app.use(morgan("dev"));
// console.log("h");
ConnectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
