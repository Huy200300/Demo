const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    brand:{
      type : String,
      require : true,
    },
    price: {
      type: Number,
      required: true,
    },
    //so luong san pham trong kho
    countInStock: {
      type: Number,
      required: true,
    },
    // so sao cua san pham
    rating: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    discount: {
      type: Number,
    },
    selled: {
      type:Number,
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
