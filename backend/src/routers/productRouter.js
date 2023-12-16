const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create',productController.createProduct);
router.put('/update/:id',authMiddleware,productController.updateProduct);
router.get('/details/:id',productController.getProductDetails);
router.delete('/delete/:id',authMiddleware,productController.deleteProduct);
router.get('/all-products',productController.getAllProducts);
router.post('/delete-many',authMiddleware,productController.deleteProductMany);
router.get('/get-all-types',productController.getAllTypes)
router.get('/get-all-brand',productController.getAllBrand)
router.get('/get-all-product-by-brand',productController.getAllProductByBrand)

module.exports = router;