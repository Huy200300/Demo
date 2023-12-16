const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/emailService");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      orderItems,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          {
            new: true,
          }
        );
        if (productData) {
          return {
            status: "success",
            message: "Success",
          };
        } else {
          return {
            status: "success",
            message: "Order creation",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        const arrID = []
        newData.forEach((item) => {
          arrID.push(item.id);
        });
        resolve({
          status: "error",
          message: `San pham voi id: ${arrID.join(",")} khong du hang`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          paidAt,
        });

        if (createdOrder) {
          await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "success",
            message: "Order create successfuly",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });
      if (order === null) {
        resolve({
          status: "error",
          message: "Order not found",
        });
      }
      resolve({
        status: "success",
        message: "Order found successfully",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({ _id: id });
      if (!order) {
        resolve({
          status: "error",
          message: "Order not found",
        });
      }
      resolve({
        status: "success",
        message: "Order found successfully",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const cancelOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const orderId = await Order.findOne({ _id: id });
      if (orderId === null) {
        resolve({
          status: "error",
          message: `San pham voi id: ${id} khong ton tai`,
        });
      }

      order = await Order.findByIdAndDelete(id);
      resolve({
        status: "success",
        message: "success",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
};
