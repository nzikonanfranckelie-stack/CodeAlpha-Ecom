const express = require('express');
const router = express.Router();
const {
  getWishlist, addToWishlist, removeFromWishlist, checkWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWishlist);
router.post('/add', protect, addToWishlist);
router.delete('/remove/:productId', protect, removeFromWishlist);
router.get('/check/:productId', protect, checkWishlist);

module.exports = router;