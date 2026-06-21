// Page d'accueil
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  try {
    const products = await api.get('/products/featured');
    container.innerHTML = products.map(p => createProductCard(p)).join('');
    initScrollReveal();
  } catch (error) {
    container.innerHTML = '<p class="text-center text-muted">Impossible de charger les produits</p>';
  }
}

async function loadNewArrivals() {
  const container = document.getElementById('new-arrivals');
  if (!container) return;
  
  try {
    const products = await api.get('/products/new-arrivals');
    container.innerHTML = products.map(p => createProductCard(p)).join('');
    initScrollReveal();
  } catch (error) {
    container.innerHTML = '<p class="text-center text-muted">Impossible de charger les produits</p>';
  }
}

// Initialisation page d'accueil
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    loadFeaturedProducts();
    loadNewArrivals();
  }
});