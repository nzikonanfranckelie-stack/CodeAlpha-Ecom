const express = require('express');
const router = express.Router();
const {
  getDashboard, getAllOrders, updateOrderStatus,
  getAllUsers, updateUser, deleteUser
} = require('../controllers/adminController');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validate');

router.use(protect, admin);

router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/products', getProducts);
router.post('/products', validateProduct, createProduct);
router.put('/products/:id', validateProduct, updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;