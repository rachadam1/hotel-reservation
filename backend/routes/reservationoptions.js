const express = require('express');
const router = express.Router();
const reservationOptionsController = require('../controllers/reservationOptionsController');

router.post('/', reservationOptionsController.addOptionToReservation);
router.get('/:reservation_id', reservationOptionsController.getOptionsForReservation);

module.exports = router;
