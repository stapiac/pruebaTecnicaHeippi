const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const confirmation = require("./middleware/confirmation");

const app = express();
const puerto = 3005;

const publicRoutes = require("./routes/publicRoutes");
const privateRoutes = require("./routes/privateRoutes");

const cors_config = {
  origin: "*",
  //credentials: true,
};

var jsonParser = bodyParser.json();

app.use("/api", cors(cors_config), jsonParser, publicRoutes);
app.use(
  "/api",
  cors(cors_config),
  jsonParser,
  auth,
  confirmation,
  privateRoutes
);

app.listen(puerto, () => {
  console.log("Server initiated");
});
