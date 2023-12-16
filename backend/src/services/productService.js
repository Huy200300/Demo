const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
      brand,
    } = newProduct;
    try {
      checkProduct = await Product.findOne({ name: name });
      if (checkProduct !== null) {
        resolve({
          status: "error",
          message: "Product name already exist",
        });
      }
      const product = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        discount,
        brand,
      });
      if (product) {
        resolve({
          status: "success",
          message: "Product created successfully",
          data: product,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const proId = await Product.findOne({ _id: id });
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (proId === null) {
        resolve({
          status: "error",
          message: "Product not found",
        });
      }
      resolve({
        status: "success",
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getProductDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const proId = await Product.findOne({ _id: id });
      if (proId === null) {
        resolve({
          status: "error",
          message: "Product not found",
        });
      }
      resolve({
        status: "success",
        message: "Product found successfully",
        data: proId,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const proId = await Product.findOne({ _id: id });
      if (proId === null) {
        resolve({
          status: "error",
          message: "Product not found",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "success",
        message: "Product deleted successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllProducts = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = [];
      const totalProduct = await Product.count();

      if (filter) {
        const label = filter[0];
        const productFilter = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "success",
          message: "Products found successfully",
          data: productFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPages: Math.ceil(totalProduct / limit),
        });
      }

      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const products = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "success",
          message: "Products found successfully",
          data: products,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPages: Math.ceil(totalProduct / limit),
        });
      }

      if (!limit) {
        products = await Product.find().sort({ createdAt: -1, updatedAt: -1 });
      } else {
        products = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }

      resolve({
        status: "success",
        message: "Products found successfully",
        data: products,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPages: Math.ceil(totalProduct / limit),
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteProductMany = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "success",
        message: "Products deleted successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTypes = await Product.distinct("type");
      resolve({
        status: "success",
        message: "Products deleted successfully",
        data: allTypes,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllBrand = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTypes = await Product.distinct("brand");
      resolve({
        status: "success",
        message: "Products deleted successfully",
        data: allTypes,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllProductByBrand = (brand,limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allBrand = await Product.aggregate([
        // { $project: { _id: 0, brand: 1 } },
        { $match: { brand: brand[1] } },
        { $limit: limit },
      ]);
      resolve({
        status: "success",
        message: "Products deleted successfully",
        data: allBrand,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getProductDetails,
  deleteProduct,
  getAllProducts,
  deleteProductMany,
  getAllTypes,
  getAllBrand,
  getAllProductByBrand,
};
