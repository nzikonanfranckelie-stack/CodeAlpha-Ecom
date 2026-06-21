const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    const filter = { actif: true };

    if (req.query.categorie) filter.categorie = req.query.categorie;
    if (req.query.marque) filter.marque = req.query.marque;
    if (req.query.enPromo === 'true') filter.enPromo = true;
    if (req.query.nouveau === 'true') filter.nouveau = true;
    if (req.query.vedette === 'true') filter.vedette = true;

    if (req.query.prixMin || req.query.prixMax) {
      filter.prix = {};
      if (req.query.prixMin) filter.prix.$gte = Number(req.query.prixMin);
      if (req.query.prixMax) filter.prix.$lte = Number(req.query.prixMax);
    }

    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',') };
    }

    let sort = { createdAt: -1 };
    switch (req.query.sort) {
      case 'prix_asc': sort = { prix: 1 }; break;
      case 'prix_desc': sort = { prix: -1 }; break;
      case 'recent': sort = { createdAt: -1 }; break;
      case 'populaire': sort = { nombreAvis: -1 }; break;
      case 'notes': sort = { notes: -1 }; break;
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    await product.deleteOne();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('categorie', { actif: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ actif: true, vedette: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ actif: true, nouveau: true })
      .sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};