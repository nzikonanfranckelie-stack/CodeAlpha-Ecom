// Génération d'une carte produit
function createProductCard(product) {
  const prixFinal = product.prixFinal || product.prix;
  const hasDiscount = product.prixPromo && product.prixPromo < product.prix;
  const discount = product.reduction || 0;
  
  let badges = '';
  if (product.nouveau) badges += '<span class="product-badge badge-new">Nouveau</span>';
  if (hasDiscount) badges += `<span class="product-badge badge-promo">-${discount}%</span>`;
  if (product.vedette) badges += '<span class="product-badge badge-hot">Top</span>';
  
  const stars = generateStars(product.notes || 0);
  
  return `
    <div class="product-card reveal">
      <div class="product-image-wrapper">
        <a href="pages/product-detail.html?id=${product._id}">
          <img src="${product.image}" alt="${product.nom}" class="product-image" loading="lazy">
        </a>
        
        ${badges ? `<div class="product-badges">${badges}</div>` : ''}
        
        <div class="product-actions">
          <button class="product-action-btn" onclick="toggleWishlist('${product._id}', this)" aria-label="Favoris">♡</button>
          <button class="product-action-btn" onclick="window.location.href='pages/product-detail.html?id=${product._id}'" aria-label="Voir">👁️</button>
        </div>
        
        <div class="quick-add" onclick="addToCart('${product._id}', 1)">
          ⚡ Ajout rapide
        </div>
      </div>
      
      <div class="product-content">
        <div class="product-category">${formatCategory(product.categorie)}</div>
        <h3 class="product-title">
          <a href="pages/product-detail.html?id=${product._id}">${product.nom}</a>
        </h3>
        
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${product.nombreAvis || 0})</span>
        </div>
        
        <div class="product-price-wrapper">
          <div class="product-price">
            <span class="current-price">${formatPrice(prixFinal)}</span>
            ${hasDiscount ? `<span class="original-price">${formatPrice(product.prix)}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" onclick="addToCart('${product._id}', 1)" aria-label="Ajouter au panier">
            🛒
          </button>
        </div>
      </div>
    </div>
  `;
}

// Génération de la pagination
function createPagination(current, total, callback) {
  if (total <= 1) return '';
  
  let html = '<div class="pagination">';
  
  html += `<button onclick="${callback}(${current - 1})" ${current === 1 ? 'disabled' : ''}>← Précédent</button>`;
  
  const startPage = Math.max(1, current - 2);
  const endPage = Math.min(total, current + 2);
  
  if (startPage > 1) {
    html += `<button onclick="${callback}(1)">1</button>`;
    if (startPage > 2) html += '<span style="padding: 0 0.5rem;">...</span>';
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button onclick="${callback}(${i})" class="${i === current ? 'active' : ''}">${i}</button>`;
  }
  
  if (endPage < total) {
    if (endPage < total - 1) html += '<span style="padding: 0 0.5rem;">...</span>';
    html += `<button onclick="${callback}(${total})">${total}</button>`;
  }
  
  html += `<button onclick="${callback}(${current + 1})" ${current === total ? 'disabled' : ''}>Suivant →</button>`;
  html += '</div>';
  
  return html;
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile menu
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('overlay');
  
  if (!menuBtn || !menu) return;
  
  const openMenu = () => {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  const closeMenu = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  menuBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}

// Mobile search toggle
function initMobileSearch() {
  const searchToggle = document.getElementById('search-toggle-mobile');
  const searchBar = document.querySelector('.search-bar');
  
  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
      searchBar.classList.toggle('active');
      if (searchBar.classList.contains('active')) {
        searchBar.querySelector('input').focus();
      }
    });
  }
}

// Newsletter
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Merci pour votre inscription !', 'success');
    form.reset();
  });
}

// Search form
function initSearchForm() {
  const form = document.getElementById('search-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = document.getElementById('search-input').value.trim();
    if (keyword) {
      window.location.href = `pages/products.html?keyword=${encodeURIComponent(keyword)}`;
    }
  });
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initMobileSearch();
  initNewsletter();
  initSearchForm();
  initScrollReveal();
});