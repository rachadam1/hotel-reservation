const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');

router.get('/', reservationsController.getAllReservations);
router.post('/', reservationsController.createReservation);
router.get('/client/:client_id', reservationsController.getReservationsByClient);
router.post('/api/reservations', reservationsController.createReservation);
router.get('/api/reservations', reservationsController.getReservationsByHotel);


module.exports = router;
