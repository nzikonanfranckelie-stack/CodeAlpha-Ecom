const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');

exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.validateRegister = [
  body('nom').trim().notEmpty().withMessage('Nom requis').isLength({ min: 2 }),
  body('prenom').trim().notEmpty().withMessage('Prénom requis').isLength({ min: 2 }),
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Minimum 6 caractères'),
  this.handleValidation
];

exports.validateLogin = [
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  this.handleValidation
];

exports.validateProduct = [
  body('nom').trim().notEmpty().withMessage('Nom requis').isLength({ min: 3 }),
  body('description').trim().notEmpty().withMessage('Description requise'),
  body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('stock').isInt({ min: 0 }).withMessage('Stock invalide'),
  body('categorie').isIn(['vetements', 'electronique', 'maison', 'livres', 'beaute', 'sport', 'autre']),
  this.handleValidation
];

exports.validateReview = [
  body('note').isInt({ min: 1, max: 5 }).withMessage('Note entre 1 et 5'),
  body('titre').trim().notEmpty().withMessage('Titre requis'),
  body('commentaire').trim().notEmpty().withMessage('Commentaire requis'),
  this.handleValidation
];

exports.validateOrder = [
  body('adresseLivraison.rue').notEmpty().withMessage('Rue requise'),
  body('adresseLivraison.ville').notEmpty().withMessage('Ville requise'),
  body('adresseLivraison.codePostal').notEmpty().withMessage('Code postal requis'),
  body('adresseLivraison.pays').notEmpty().withMessage('Pays requis'),
  body('methodePaiement').isIn(['carte', 'paypal', 'virement', 'a_la_livraison']),
  this.handleValidation
];