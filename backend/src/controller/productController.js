const productService = require("../services/productService");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      discount,
      description,
      brand,
    } = req.body;

    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !brand ||
      !discount
    ) {
      return res.status(404).json({
        status: "error",
        message: "Please fill all fields",
      });
    }
    const respone = await productService.createProduct(req.body);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const proId = req.params.id;

    const data = req.body;
    if (!proId) {
      return res.status(404).json({
        status: "error",
        message: "the productId is required",
      });
    }
    const respone = await productService.updateProduct(proId, data);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const proId = req.params.id;
    if (!proId) {
      return res.status(404).json({
        status: "error",
        message: "the productId is required",
      });
    }
    const respone = await productService.getProductDetails(proId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const proId = req.params.id;
    if (!proId) {
      return res.status(404).json({
        status: "error",
        message: "the productId is required",
      });
    }
    const respone = await productService.deleteProduct(proId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const respone = await productService.getAllProducts(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteProductMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "error",
        message: "the ids is required",
      });
    }
    const respone = await productService.deleteProductMany(ids);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getAllTypes = async (req, res) => {
  try {
    const respone = await productService.getAllTypes();
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const respone = await productService.getAllBrand();
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getAllProductByBrand = async (req, res) => {
  try {
    const { brand, limit} = await req.query;
    const respone = await productService.getAllProductByBrand(brand,Number(limit) ||  5);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
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
