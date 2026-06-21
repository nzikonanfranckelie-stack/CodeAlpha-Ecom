const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'nom prix prixPromo stock image categorie slug'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    let subtotal = 0;
    const items = cart.items.map(item => {
      const product = item.product;
      const prixUnitaire = product.prixPromo && product.prixPromo < product.prix 
        ? product.prixPromo : product.prix;
      const total = prixUnitaire * item.quantity;
      subtotal += total;
      
      return {
        _id: product._id,
        nom: product.nom,
        slug: product.slug,
        prix: product.prix,
        prixPromo: product.prixPromo,
        prixUnitaire,
        stock: product.stock,
        image: product.image,
        categorie: product.categorie,
        quantity: item.quantity,
        total,
        disponible: product.stock >= item.quantity && product.actif
      };
    });

    const livraison = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
    const taxes = subtotal * 0.20;
    const total = subtotal + livraison + taxes;

    res.json({ items, subtotal, livraison, taxes, total, itemCount: items.length });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    
    if (!product || !product.actif) {
      return res.status(404).json({ message: 'Produit non disponible' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    
    if (newQuantity > product.stock) {
      return res.status(400).json({ 
        message: `Stock insuffisant. Seulement ${product.stock} disponibles` 
      });
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ message: 'Produit ajouté au panier', cartCount });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantité invalide' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Produit non trouvé dans le panier' });

    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      return res.status(400).json({ 
        message: `Stock insuffisant. Seulement ${product.stock} disponibles` 
      });
    }

    item.quantity = quantity;
    await cart.save();
    res.json({ message: 'Panier mis à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    cart.items = [];
    await cart.save();
    res.json({ message: 'Panier vidé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const count = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};