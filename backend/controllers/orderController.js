const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const generateOrderNumber = () => {
  const date = new Date();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CMD-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${random}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { adresseLivraison, methodePaiement, methodeLivraison, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Votre panier est vide' });
    }

    // Vérifier stock et calculer totaux
    let sousTotal = 0;
    const items = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.actif) {
        return res.status(400).json({ message: `Produit ${item.product?.nom} indisponible` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour ${product.nom}` 
        });
      }

      const prixUnitaire = product.prixPromo && product.prixPromo < product.prix 
        ? product.prixPromo : product.prix;
      const total = prixUnitaire * item.quantity;
      sousTotal += total;

      items.push({
        product: product._id,
        nom: product.nom,
        image: product.image,
        quantite: item.quantity,
        prixUnitaire,
        total
      });
    }

    const livraison = methodeLivraison === 'express' ? 12.99 : (sousTotal > 50 ? 0 : 5.99);
    const taxes = sousTotal * 0.20;
    const total = sousTotal + livraison + taxes;

    // Décrémenter le stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Créer la commande
    const order = await Order.create({
      user: req.user._id,
      numeroCommande: generateOrderNumber(),
      items,
      adresseLivraison: {
        nom: req.user.nom,
        prenom: req.user.prenom,
        telephone: req.user.telephone,
        ...adresseLivraison
      },
      sousTotal,
      livraison,
      taxes,
      total,
      methodePaiement,
      methodeLivraison,
      notes,
      statut: methodePaiement === 'a_la_livraison' ? 'en_attente' : 'payee',
      paiementEffectue: methodePaiement === 'a_la_livraison' ? false : true,
      datePaiement: methodePaiement === 'a_la_livraison' ? null : new Date()
    });

    // Vider le panier
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const count = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    if (!['en_attente', 'payee'].includes(order.statut)) {
      return res.status(400).json({ message: 'Commande non annulable' });
    }

    // Remettre le stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantite }
      });
    }

    order.statut = 'annulee';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};