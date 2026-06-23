const express = require('express');
const cartController = require('../controllers/cartController');
const { optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(optionalProtect);

router.get('/', cartController.getCart);
router.post('/', cartController.saveCart);
router.post('/add', cartController.addToCart);
router.put('/quantity', cartController.updateCartQuantity);
router.delete('/remove', cartController.removeFromCart);

module.exports = router;
