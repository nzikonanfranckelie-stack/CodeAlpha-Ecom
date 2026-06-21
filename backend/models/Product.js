const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  descriptionCourte: String,
  prix: { type: Number, required: true, min: 0 },
  prixPromo: { type: Number, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  images: [{ type: String }],
  image: { type: String, default: '/images/default.png' },
  categorie: { 
    type: String, 
    required: true,
    enum: ['vetements', 'electronique', 'maison', 'livres', 'beaute', 'sport', 'autre']
  },
  tags: [String],
  marque: String,
  notes: { type: Number, default: 0 },
  nombreAvis: { type: Number, default: 0 },
  actif: { type: Boolean, default: true },
  enPromo: { type: Boolean, default: false },
  nouveau: { type: Boolean, default: false },
  vedette: { type: Boolean, default: false },
  poids: Number,
  dimensions: {
    longueur: Number,
    largeur: Number,
    hauteur: Number
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

productSchema.virtual('prixFinal').get(function() {
  return this.prixPromo && this.prixPromo < this.prix ? this.prixPromo : this.prix;
});

productSchema.virtual('reduction').get(function() {
  if (!this.prixPromo || this.prixPromo >= this.prix) return 0;
  return Math.round(((this.prix - this.prixPromo) / this.prix) * 100);
});

productSchema.index({ nom: 'text', description: 'text', tags: 'text' });
productSchema.index({ categorie: 1, actif: 1 });
productSchema.index({ prix: 1 });
productSchema.index({ createdAt: -1 });

productSchema.pre('save', function(next) {
  if (this.isModified('nom')) {
    this.slug = this.nom.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  if (this.prixPromo && this.prixPromo < this.prix) {
    this.enPromo = true;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);