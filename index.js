const express = require("express");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const ConnectDb = require("./Config/Connect");
const userRoutes = require("./router/User.route");
const AdminAddtyreRoutes = require("./router/admin/Addtyre.route");
const AdminMappingRoutes = require("./router/admin/Mapping.route");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/admin/addtyre", AdminAddtyreRoutes);
app.use("/api/admin/mapping", AdminMappingRoutes);

ConnectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
