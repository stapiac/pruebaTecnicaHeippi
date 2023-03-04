const mongoose = require("mongoose");

const usuario = "heippi";
const pass = "testpassword123";
const dbname = "Heippi";
const dburl = `mongodb+srv://${usuario}:${pass}@cluster.nka2lm5.mongodb.net/${dbname}?retryWrites=true&w=majority`;
mongoose
  .connect(dburl)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log("Unable to connect to DB", e);
  });

module.exports = mongoose;
