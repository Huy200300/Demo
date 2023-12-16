const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discount:{
          type: Number,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    //tong gia san pham
    itemsPrice: {
      type: Number,
      required: true,
    },
    // phi giao hang
    shippingPrice: {
      type: Number,
      required: true,
    },
    // tong thanh toan
    totalPrice: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // trang thai thanh toan
    isPaid: {
      type: Boolean,
      default: false
    },
    // thoi gian thanh toan
    paidAt: {
      type: Date,
    },
    // trang thai giao hang
    isDelivered: {
      type: Boolean,
      default: false,
    },
    // thoi gian giao hang
    deliverAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
