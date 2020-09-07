require("dotenv").config();
require("./handlers/mongo");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route");
const cartRoute = require("./routes/cart.route");

const apiUserRoute = require("./routes/api.user.route");
const apiCartRoute = require("./routes/api.cart.route");
const apiClient = require("./routes/api.route");
const apiTransaction = require("./routes/api.transaction.route");

const apiAdmin = require("./routes/admin.route");

const authMiddleware = require("./middlewares/auth.middleware");
const sessionMiddleware = require("./middlewares/session.middleware");
const jwtMiddlware = require("./middlewares/jwt.middleware");

const PORT = process.env.PORT || 3000;

// Add headers

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSTION_SECRET));
//app.use(sessionMiddleware);

app.use(express.static("public"));
//routes

app.get("/", (req, res) => {
  res.render("index", {
    name: "AAA",
  });
});

app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoute);

app.use("/api/users", apiUserRoute);
app.use("/api/cart", apiCartRoute);
app.use("/api/transaction", apiTransaction);
app.use("/api", apiClient);
app.use("/api/admin", apiAdmin);

app.use((req, res) => {
  res.status(404).render("page-error");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
