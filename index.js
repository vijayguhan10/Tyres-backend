const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const ConnectDb = require("./Config/Connect");
const userRoutes = require("./router/User.route");
const AddressRoutes = require("./router/Address.route");
const OrderTyres_clients = require("./router/client/Index.route");
const AdminRouter = require("./router/admin/Index.route");
const ShopRouter = require("./router/shop/Index.route");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/address", AddressRoutes);
app.use("/api/client", OrderTyres_clients);
app.use("/api/admin", AdminRouter);
app.use("/api/shops", ShopRouter);

console.log("h");
ConnectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
