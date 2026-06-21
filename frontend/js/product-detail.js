let currentProduct = null;

async function loadProductDetail(productId) {
  const container = document.getElementById('product-detail-container');
  
  // Skeleton
  container.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-gallery">
        <div class="main-image"><div class="skeleton skeleton-image"></div></div>
      </div>
      <div class="product-detail-info">
        <div class="skeleton skeleton-text" style="width: 30%;"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text" style="width: 50%;"></div>
      </div>
    </div>
  `;
  
  try {
    const product = await api.get(`/products/${productId}`);
    currentProduct = product;
    
    document.title = `${product.nom} - MonShop`;
    document.getElementById('breadcrumb-product').textContent = product.nom;
    
    const prixFinal = product.prixFinal || product.prix;
    const hasDiscount = product.prixPromo && product.prixPromo < product.prix;
    const discount = product.reduction || 0;
    const stars = generateStars(product.notes || 0);
    
    const images = product.images?.length ? product.images : [product.image];
    
    container.innerHTML = `
      <div class="product-detail-layout">
        <div class="product-gallery">
          <div class="main-image">
            <img src="${images[0]}" alt="${product.nom}" id="main-image">
          </div>
          ${images.length > 1 ? `
            <div class="thumbnail-list">
              ${images.map((img, i) => `
                <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
                  <img src="${img}" alt="">
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="product-detail-info">
          <div class="product-category">${formatCategory(product.categorie)} ${product.marque ? `• ${product.marque}` : ''}</div>
          <h1>${product.nom}</h1>
          
          <div class="product-detail-rating">
            <span class="stars" style="font-size: 1.25rem;">${stars}</span>
            <span>${product.notes?.toFixed(1) || '0'}/5</span>
            <span class="text-muted">(${product.nombreAvis || 0} avis)</span>
          </div>
          
          <div class="product-detail-price">
            <span class="current-price">${formatPrice(prixFinal)}</span>
            ${hasDiscount ? `
              <span class="original-price">${formatPrice(product.prix)}</span>
              <span class="discount-percent">-${discount}%</span>
            ` : ''}
          </div>
          
          <p class="product-detail-description">${product.description}</p>
          
          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-icon">📦</span>
              <div>
                <div class="meta-label">Stock</div>
                <div class="meta-value">${product.stock > 0 ? `${product.stock} disponibles` : 'Rupture'}</div>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🚚</span>
              <div>
                <div class="meta-label">Livraison</div>
                <div class="meta-value">Gratuite dès 50€</div>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">↩️</span>
              <div>
                <div class="meta-label">Retours</div>
                <div class="meta-value">30 jours</div>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🔒</span>
              <div>
                <div class="meta-label">Paiement</div>
                <div class="meta-value">100% sécurisé</div>
              </div>
            </div>
          </div>
          
          <div class="quantity-selector">
            <label>Quantité :</label>
            <div class="quantity-controls">
              <button class="qty-btn" onclick="changeQuantity(-1)">−</button>
              <input type="number" class="qty-input" id="quantity" value="1" min="1" max="${product.stock}">
              <button class="qty-btn" onclick="changeQuantity(1)">+</button>
            </div>
          </div>
          
          <div class="product-actions-detail">
            <button class="btn btn-primary btn-lg" onclick="addCurrentToCart()" ${product.stock === 0 ? 'disabled' : ''}>
              🛒 ${product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>
            <button class="wishlist-btn-detail" onclick="toggleWishlist('${product._id}', this)">♡</button>
          </div>
        </div>
      </div>

      <div class="product-tabs">
        <div class="tabs-nav">
          <button class="tab-btn active" onclick="switchTab('description', this)">📝 Description</button>
          <button class="tab-btn" onclick="switchTab('reviews', this)">⭐ Avis (${product.nombreAvis || 0})</button>
          <button class="tab-btn" onclick="switchTab('shipping', this)">🚚 Livraison</button>
        </div>
        
        <div class="tab-content active" id="tab-description">
          <h3>Description complète</h3>
          <p style="line-height: 1.8; color: var(--gray-700);">${product.description}</p>
          ${product.tags?.length ? `
            <div style="margin-top: 1.5rem;">
              <strong>Tags :</strong>
              ${product.tags.map(t => `<span style="display: inline-block; background: var(--gray-100); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); margin: 0.25rem; font-size: 0.875rem;">#${t}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="tab-content" id="tab-reviews">
          <div id="reviews-container">Chargement des avis...</div>
        </div>
        
        <div class="tab-content" id="tab-shipping">
          <h3>Informations de livraison</h3>
          <ul style="line-height: 2; color: var(--gray-700);">
            <li>🚚 <strong>Livraison standard :</strong> 3-5 jours ouvrés (5.99€ ou gratuite dès 50€)</li>
            <li>⚡ <strong>Livraison express :</strong> 24-48h (12.99€)</li>
            <li>↩️ <strong>Retours :</strong> 30 jours pour changer d'avis</li>
            <li>📦 <strong>Suivi :</strong> Numéro de suivi envoyé par email</li>
          </ul>
        </div>
      </div>
    `;
    
    loadReviews(product._id);
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❌</div>
        <h2>Produit non trouvé</h2>
        <p>${error.message}</p>
        <a href="products.html" class="btn btn-primary">Retour à la boutique</a>
      </div>
    `;
  }
}

function changeImage(src, thumb) {
  document.getElementById('main-image').src = src;
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function changeQuantity(delta) {
  const input = document.getElementById('quantity');
  const newVal = parseInt(input.value) + delta;
  if (newVal >= 1 && newVal <= parseInt(input.max)) {
    input.value = newVal;
  }
}

async function addCurrentToCart() {
  if (!currentProduct) return;
  const quantity = parseInt(document.getElementById('quantity').value);
  await addToCart(currentProduct._id, quantity);
}

function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

async function loadReviews(productId) {
  const container = document.getElementById('reviews-container');
  try {
    const reviews = await api.get(`/reviews/product/${productId}`);
    
    if (reviews.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding: 2rem;">
          <p class="text-muted">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = reviews.map(r => `
      <div style="padding: 1.5rem 0; border-bottom: 1px solid var(--gray-200);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div>
            <strong>${r.nom}</strong>
            <div class="stars">${generateStars(r.note)}</div>
          </div>
          <small class="text-muted">${formatDate(r.createdAt)}</small>
        </div>
        <h4 style="margin-bottom: 0.5rem;">${r.titre}</h4>
        <p style="color: var(--gray-700); line-height: 1.7;">${r.commentaire}</p>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<p class="text-muted">Impossible de charger les avis</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = getUrlParams();
  if (params.id) {
    loadProductDetail(params.id);
  } else {
    window.location.href = 'products.html';
  }
});