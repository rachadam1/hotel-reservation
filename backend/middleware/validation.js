const { body } = require('express-validator');

const validationRules = {
    register: [
        body('nom')
            .isLength({ min: 2, max: 50 })
            .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
        body('prenom')
            .isLength({ min: 2, max: 50 })
            .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
        body('email')
            .isEmail()
            .withMessage('Email invalide'),
        body('mot_de_passe')
            .isLength({ min: 6 })
            .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    ],
    login: [
        body('email')
            .isEmail()
            .withMessage('Email invalide'),
        body('mot_de_passe')
            .notEmpty()
            .withMessage('Le mot de passe est requis')
    ],
    reservation: [
        body('chambre_id')
            .isInt({ min: 1 })
            .withMessage('ID de chambre invalide'),
        body('type_reservation')
            .isIn(['horaire', 'classique'])
            .withMessage('Type de réservation invalide'),
        body('nombre_adultes')
            .isInt({ min: 1, max: 10 })
            .withMessage('Nombre d\'adultes invalide')
    ]
};

module.exports = validationRules;