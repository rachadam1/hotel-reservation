const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');
const validationRules = require('../middleware/validation');

router.use(authMiddleware.verifierToken);

router.post('/', validationRules.reservation, reservationController.createReservation);
router.get('/mes-reservations', reservationController.getClientReservations);
router.patch('/:id/annuler', reservationController.cancelReservation);

module.exports = router;