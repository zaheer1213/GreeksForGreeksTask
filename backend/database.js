const mongoose = require("mongoose");
const dataBase = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/productinfo")
    .then((data) => {
      console.log(data.connection.host);
    })
    .catch((error) => console.log(error));
};
module.exports = dataBase;
