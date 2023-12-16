const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.get('/get-all-users', authMiddleware,userController.getAllUsers);
router.post('/sign-up',userController.createrUser);
router.post('/sign-in',userController.userLogin);
router.post('/log-out',userController.userLogout);
router.put('/update-user/:id',authUserMiddleware,userController.updateUser);
router.delete('/delete-user/:id',authMiddleware,userController.deleteUser);
router.get('/get-users-detail/:id',authUserMiddleware,userController.getUsersDetail);
router.post('/refresh-token',userController.refreshToken);
router.post('/delete-many',authMiddleware,userController.deleteManyUser);

module.exports = router;