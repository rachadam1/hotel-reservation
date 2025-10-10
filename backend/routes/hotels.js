const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authMiddleware = require('../middleware/auth');

router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.get('/:hotelId/chambres-disponibles', hotelController.getAvailableRooms);

module.exports = router;