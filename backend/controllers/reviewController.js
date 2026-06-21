const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, approuve: true })
      .populate('user', 'nom prenom avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, note, titre, commentaire } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    const alreadyReviewed = await Review.findOne({ 
      user: req.user._id, 
      product: productId 
    });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Vous avez déjà donné votre avis' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      nom: `${req.user.prenom} ${req.user.nom.charAt(0)}.`,
      note,
      titre,
      commentaire
    });

    // Mettre à jour la note moyenne du produit
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length;
    
    product.notes = Number(avgRating.toFixed(1));
    product.nombreAvis = reviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avis non trouvé' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await review.deleteOne();

    // Recalculer moyenne
    const reviews = await Review.find({ product: review.product });
    const product = await Product.findById(review.product);
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length;
      product.notes = Number(avgRating.toFixed(1));
      product.nombreAvis = reviews.length;
    } else {
      product.notes = 0;
      product.nombreAvis = 0;
    }
    await product.save();

    res.json({ message: 'Avis supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};