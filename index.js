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

const authMiddleware = require("./middlewares/auth.middleware");
const sessionMiddleware = require("./middlewares/session.middleware");
const jwtMiddlware = require("./middlewares/jwt.middleware");

const Products = require("./models/products/products.model");
const Users = require("./models/users/users.model");

const PORT = process.env.PORT || 3000;

// Add headers

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSTION_SECRET));
//app.use(sessionMiddleware);

app.use(express.static("public"));

app.post("/api/products", (req, res) => {
  Products.find((err, products) => {
    if (err) {
      res.json({ Error: err });
    } else {
      res.json(products);
    }
  });
});
//routes
app.get("/", jwtMiddlware.jwt, (req, res) => {
  res.render("index", {
    name: "AAA",
  });
});

app.use("/users", jwtMiddlware.jwt, userRoute);
app.use("/products", jwtMiddlware.jwt, productRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoute);

app.use("/api/users", apiUserRoute);

app.use((req, res) => {
  res.status(404).render("page-error");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
