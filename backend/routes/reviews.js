const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validateReview } = require('../middleware/validate');

router.get('/product/:productId', getReviews);
router.post('/', protect, validateReview, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;