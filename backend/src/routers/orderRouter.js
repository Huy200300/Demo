const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const { authUserMiddleware,authMiddleware } = require('../middleware/authMiddleware');

router.post('/create',authUserMiddleware,orderController.createOrder);
router.get('/get-all-order-details/:id',authUserMiddleware,orderController.getAllOrderDetails);
router.get('/get-details-order/:id',authUserMiddleware, orderController.getOrderDetails)
router.delete('/cancel-order/:id',authUserMiddleware, orderController.cancelOrderDetails)
router.get('/get-all-order',authMiddleware, orderController.getAllOrder)
module.exports = router;