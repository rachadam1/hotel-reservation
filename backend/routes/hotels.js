const express = require('express');
const router = express.Router();
const hotelsController = require('../controllers/hotelsController');

router.get('/', hotelsController.getAllHotels);
router.post('/', hotelsController.createHotel);
router.get('/api/hotels', hotelsController.getAllHotels);
router.get('/api/hotels/:id', hotelsController.getHotelById);
router.put('/api/hotels/:id', hotelsController.updateHotel);
router.post('/api/hotels', hotelsController.createHotel);
router.get('/api/hotels/:id/stats', hotelsController.getHotelStats);

module.exports = router;
