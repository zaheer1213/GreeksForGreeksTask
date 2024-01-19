const mongoose = require("mongoose");

const TransactionScehma = new mongoose.Schema({
  id: Number,
  title: {
    type: String,
    required: [true, "please enter title"],
  },
  price: {
    type: String,
    required: [true, "please enter price"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "please enter description"],
  },
  category: {
    type: String,
    required: [true, "please enter catagory"],
  },
  image: String,
  sold: Boolean,
  dateOfSale: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Transaction", TransactionScehma);
