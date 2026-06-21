const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numeroCommande: { type: String, unique: true, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    nom: String,
    image: String,
    quantite: { type: Number, required: true, min: 1 },
    prixUnitaire: { type: Number, required: true },
    total: Number
  }],
  adresseLivraison: {
    nom: String,
    prenom: String,
    telephone: String,
    rue: { type: String, required: true },
    complement: String,
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    pays: { type: String, required: true, default: 'France' }
  },
  sousTotal: { type: Number, required: true },
  livraison: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  total: { type: Number, required: true },
  statut: { 
    type: String, 
    enum: ['en_attente', 'payee', 'preparee', 'expediee', 'livree', 'annulee', 'remboursee'],
    default: 'en_attente'
  },
  methodePaiement: { 
    type: String, 
    enum: ['carte', 'paypal', 'virement', 'a_la_livraison'],
    default: 'carte'
  },
  paiementEffectue: { type: Boolean, default: false },
  datePaiement: Date,
  idTransaction: String,
  methodeLivraison: { type: String, default: 'standard' },
  dateLivraisonEstimee: Date,
  dateLivraison: Date,
  suivi: String,
  notes: String
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ statut: 1 });

module.exports = mongoose.model('Order', orderSchema);