const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nom: String,
  note: { type: Number, required: true, min: 1, max: 5 },
  titre: { type: String, required: true },
  commentaire: { type: String, required: true },
  approuve: { type: Boolean, default: true },
  utile: { type: Number, default: 0 }
}, { timestamps: true });

reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);