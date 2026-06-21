const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  {
    nom: 'T-shirt Coton Bio Premium',
    description: 'T-shirt confortable en coton biologique certifié GOTS. Coupe classique intemporelle, disponible en plusieurs coloris. Tissu doux et respirant, parfait pour un usage quotidien. Coutures renforcées pour une durabilité maximale.',
    descriptionCourte: 'T-shirt bio confortable et durable',
    prix: 29.99,
    prixPromo: 24.99,
    stock: 50,
    categorie: 'vetements',
    marque: 'EcoWear',
    tags: ['bio', 'coton', 'durable'],
    nouveau: true,
    vedette: true,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600'
    ]
  },
  {
    nom: 'Casque Audio Bluetooth Premium',
    description: 'Casque sans fil avec réduction de bruit active de dernière génération. Autonomie exceptionnelle de 30h. Son haute fidélité avec drivers 40mm. Coussinets en mousse à mémoire de forme pour un confort optimal.',
    prix: 199.99,
    prixPromo: 159.99,
    stock: 25,
    categorie: 'electronique',
    marque: 'SoundPro',
    tags: ['bluetooth', 'sans-fil', 'audio'],
    enPromo: true,
    vedette: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600']
  },
  {
    nom: 'Lampe de Bureau LED Design',
    description: 'Lampe de bureau moderne avec variateur tactile de luminosité (5 niveaux). Port USB intégré pour recharger vos appareils. Bras articulé flexible. Économie d\'énergie de 80% par rapport aux lampes traditionnelles.',
    prix: 49.99,
    stock: 40,
    categorie: 'maison',
    marque: 'LightHome',
    tags: ['led', 'design', 'bureau'],
    nouveau: true,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600']
  },
  {
    nom: 'Roman "L\'Étranger" - Albert Camus',
    description: 'Chef-d\'œuvre de la littérature française du XXe siècle. Édition de poche avec préface inédite et notes explicatives. Parfait pour les étudiants et amateurs de littérature classique.',
    prix: 12.50,
    stock: 100,
    categorie: 'livres',
    marque: 'Gallimard',
    tags: ['classique', 'litterature', 'français'],
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600']
  },
  {
    nom: 'Jean Slim Fit Stretch',
    description: 'Jean slim en denim stretch premium, coupe moderne et confortable. Lavage délavé tendance. 98% coton, 2% élasthanne. Coutures renforcées, 5 poches.',
    prix: 59.99,
    prixPromo: 44.99,
    stock: 35,
    categorie: 'vetements',
    marque: 'DenimCo',
    tags: ['jean', 'slim', 'stretch'],
    enPromo: true,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600']
  },
  {
    nom: 'Smartphone 5G Ultra',
    description: 'Smartphone dernière génération avec écran AMOLED 6.7" 120Hz. Triple caméra 108MP avec stabilisation optique. Processeur 8 cores, 8GB RAM, 256GB stockage. Batterie 5000mAh avec charge rapide 65W.',
    prix: 799.99,
    stock: 15,
    categorie: 'electronique',
    marque: 'TechPro',
    tags: ['5g', 'smartphone', 'premium'],
    vedette: true,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600']
  },
  {
    nom: 'Coussin Décoratif Velours',
    description: 'Coussin en velours doux et luxueux, dimensions 45x45cm. Motifs géométriques tendance. Garnissage en fibres creuses siliconées. Housse déhoussable avec fermeture invisible. Lavable en machine à 30°.',
    prix: 24.99,
    stock: 60,
    categorie: 'maison',
    marque: 'HomeStyle',
    tags: ['decoration', 'velours', 'coussin'],
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600',
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600']
  },
  {
    nom: 'Guide Complet de Cuisine Française',
    description: 'Plus de 200 recettes traditionnelles françaises illustrées. Techniques expliquées pas à pas par un chef étoilé. Inclut conseils sur les accords mets-vins. Reliure cousue, papier premium.',
    prix: 35.00,
    stock: 30,
    categorie: 'livres',
    marque: 'Marabout',
    tags: ['cuisine', 'recettes', 'français'],
    nouveau: true,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600',
    images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=600']
  },
  {
    nom: 'Crème Hydratante Visage Bio',
    description: 'Crème hydratante visage formulée avec 95% d\'ingrédients d\'origine naturelle. À l\'aloe vera et huile d\'argan bio. Convient à tous types de peaux, même sensibles. Sans paraben, sans silicone.',
    prix: 28.90,
    stock: 45,
    categorie: 'beaute',
    marque: 'NatureBio',
    tags: ['bio', 'soin', 'visage'],
    nouveau: true,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600']
  },
  {
    nom: 'Tapis de Yoga Premium',
    description: 'Tapis de yoga antidérapant 6mm d\'épaisseur. Matériau TPE écologique, sans PVC ni latex. Dimensions 183x61cm. Sangle de transport incluse. Double face texturée pour une adhérence optimale.',
    prix: 39.99,
    prixPromo: 32.99,
    stock: 55,
    categorie: 'sport',
    marque: 'YogaLife',
    tags: ['yoga', 'fitness', 'sport'],
    enPromo: true,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600']
  },
  {
    nom: 'Montre Connectée Sport',
    description: 'Montre connectée avec GPS intégré, cardiofréquencemètre et oxymètre. Plus de 100 modes sportifs. Écran AMOLED 1.4". Autonomie 14 jours. Étanche 5ATM. Notifications smartphone.',
    prix: 149.99,
    stock: 20,
    categorie: 'electronique',
    marque: 'FitTech',
    tags: ['montre', 'sport', 'connectee'],
    vedette: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600']
  },
  {
    nom: 'Sac à Dos Urbain Imperméable',
    description: 'Sac à dos urbain 25L avec compartiment laptop 15.6". Tissu imperméable 600D. Port USB externe pour charger votre téléphone. Bretelles ergonomiques rembourrées. Multiples poches organisatrices.',
    prix: 69.99,
    stock: 30,
    categorie: 'vetements',
    marque: 'UrbanPack',
    tags: ['sac', 'urbain', 'laptop'],
    nouveau: true,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600']
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un admin par défaut
    const adminExists = await User.findOne({ email: 'admin@monshop.com' });
    if (!adminExists) {
      await User.create({
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@monshop.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin créé: admin@monshop.com / admin123');
    }

    // Créer un utilisateur test
    const userExists = await User.findOne({ email: 'user@monshop.com' });
    if (!userExists) {
      await User.create({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'user@monshop.com',
        password: 'user123',
        role: 'user',
        adresse: {
          rue: '123 Rue de la Paix',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France'
        }
      });
      console.log('✅ Utilisateur créé: user@monshop.com / user123');
    }

    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`✅ ${products.length} produits insérés`);

    process.exit();
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seed();