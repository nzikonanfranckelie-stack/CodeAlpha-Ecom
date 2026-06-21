# 🛍️ MonShop - Boutique E-commerce Full Stack

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)

> Une application e-commerce moderne et complète développée avec **Node.js/Express** et **MongoDB** côté backend, et **HTML/CSS/JavaScript Vanilla** côté frontend.

![Aperçu du projet](https://via.placeholder.com/1200x600/6366f1/ffffff?text=MonShop+E-commerce)

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [📸 Captures d'écran](#-captures décran)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📖 Utilisation](#-utilisation)
- [📁 Structure du projet](#-structure-du-projet)
- [🔌 API Endpoints](#-api-endpoints)
- [🧪 Comptes de test](#-comptes-de-test)
- [📝 Scripts disponibles](#-scripts-disponibles)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)
- [👤 Auteur](#-auteur)

## ✨ Fonctionnalités

### 👤 Côté client
- ✅ Inscription et connexion sécurisées (JWT)
- ✅ Catalogue de produits avec recherche et filtres avancés
- ✅ Pagination intelligente
- ✅ Pages détaillées des produits avec galerie d'images
- ✅ Système d'avis et notations
- ✅ Panier d'achat persistant avec validation du stock
- ✅ Liste de souhaits (wishlist)
- ✅ Processus de checkout complet en plusieurs étapes
- ✅ Historique des commandes avec suivi
- ✅ Profil utilisateur modifiable
- ✅ Design 100% responsive (mobile-first)

### 🛠️ Côté administration
- ✅ Dashboard avec statistiques (ventes, utilisateurs, commandes)
- ✅ CRUD complet des produits
- ✅ Gestion des commandes (statuts)
- ✅ Gestion des utilisateurs
- ✅ Upload d'images
- ✅ Graphiques de ventes mensuelles

### 🔒 Sécurité
- ✅ Authentification JWT avec expiration
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Rate limiting
- ✅ Helmet (headers HTTP sécurisés)
- ✅ Validation des données (express-validator)
- ✅ Protection CORS
- ✅ Middleware d'autorisation (admin/user)

## 🛠️ Technologies

### Backend
| Technologie | Rôle |
|-------------|------|
| **Node.js** | Environnement d'exécution |
| **Express.js** | Framework web |
| **MongoDB** | Base de données NoSQL |
| **Mongoose** | ODM MongoDB |
| **JWT** | Authentification |
| **Bcrypt** | Hachage des mots de passe |
| **Multer** | Upload de fichiers |
| **Stripe** | Paiement (prévu) |
| **Nodemailer** | Envoi d'emails |

### Frontend
| Technologie | Rôle |
|-------------|------|
| **HTML5** | Structure |
| **CSS3** | Styles modernes (variables, grid, flexbox) |
| **JavaScript (ES6+)** | Logique applicative |
| **Fetch API** | Requêtes HTTP |
| **LocalStorage** | Persistance côté client |

### Outils
- **Git** & **GitHub** pour le versionning
- **Nodemon** pour le développement
- **VS Code** comme éditeur recommandé

## 📸 Captures d'écran

<details>
<summary>🖼️ Voir les captures</summary>

### Page d'accueil
![Accueil](docs/screenshots/home.png)

### Catalogue produits
![Produits](docs/screenshots/products.png)

### Détail produit
![Détail](docs/screenshots/product-detail.png)

### Panier
![Panier](docs/screenshots/cart.png)

### Checkout
![Checkout](docs/screenshots/checkout.png)

### Dashboard Admin
![Admin](docs/screenshots/admin.png)

</details>

> 💡 **Note** : Ajoutez vos propres captures dans le dossier `docs/screenshots/`

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [MongoDB](https://www.mongodb.com/try/download/) installé et démarré
- [Git](https://git-scm.com/)

### Étapes d'installation

#### 1. Cloner le dépôt

```bash
git clone https://github.com/VOTRE_USERNAME/monshop-ecommerce.git
cd monshop-ecommerce