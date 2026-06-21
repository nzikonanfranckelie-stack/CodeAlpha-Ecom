const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, getProductBySlug,
  createProduct, updateProduct, deleteProduct,
  getCategories, getFeatured, getNewArrivals
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validate');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeatured);
router.get('/new-arrivals', getNewArrivals);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.post('/', protect, admin, validateProduct, createProduct);
router.put('/:id', protect, admin, validateProduct, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;