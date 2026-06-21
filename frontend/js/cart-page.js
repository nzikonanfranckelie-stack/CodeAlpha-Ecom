let cartData = null;

async function loadCart() {
  if (!requireAuth()) return;
  
  const container = document.getElementById('cart-container');
  container.innerHTML = '<div class="text-center" style="padding: 3rem;"><div class="loader"></div></div>';
  
  try {
    cartData = await api.get('/cart');
    
    if (cartData.items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats</p>
          <a href="products.html" class="btn btn-primary btn-lg">🛍️ Découvrir la boutique</a>
        </div>
      `;
      return;
    }
    
    renderCart();
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Erreur: ${error.message}</div>`;
  }
}

function renderCart() {
  const container = document.getElementById('cart-container');
  const freeShippingThreshold = 50;
  const remaining = Math.max(0, freeShippingThreshold - cartData.subtotal);
  const progress = Math.min(100, (cartData.subtotal / freeShippingThreshold) * 100);
  
  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items-container">
        ${cartData.items.map(item => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.nom}">
            </div>
            <div class="cart-item-info">
              <h3><a href="product-detail.html?id=${item._id}">${item.nom}</a></h3>
              <div class="cart-item-meta">
                <span>${formatCategory(item.categorie)}</span>
                ${!item.disponible ? '<span class="text-danger">⚠️ Stock insuffisant</span>' : ''}
              </div>
              <div class="cart-item-actions">
                <div class="quantity-controls">
                  <button class="qty-btn" onclick="updateQuantity('${item._id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                  <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${item.stock}" onchange="updateQuantity('${item._id}', parseInt(this.value))">
                  <button class="qty-btn" onclick="updateQuantity('${item._id}', ${item.quantity + 1})" ${item.quantity >= item.stock ? 'disabled' : ''}>+</button>
                </div>
              </div>
            </div>
            <div class="cart-item-price">
              <div class="cart-item-unit-price">${formatPrice(item.prixUnitaire)} / unité</div>
              <div class="cart-item-total">${formatPrice(item.total)}</div>
              <button class="remove-item-btn" onclick="removeItem('${item._id}')">🗑️ Supprimer</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="cart-summary">
        <h2>Récapitulatif</h2>
        
        ${remaining > 0 ? `
          <div class="shipping-progress">
            <div style="font-size: 0.9rem; color: var(--gray-700);">
              Plus que <strong class="text-primary">${formatPrice(remaining)}</strong> pour la livraison gratuite !
            </div>
            <div class="shipping-progress-bar">
              <div class="shipping-progress-fill" style="width: ${progress}%;"></div>
            </div>
          </div>
        ` : `
          <div class="free-shipping-notice">
            ✅ Félicitations ! Vous bénéficiez de la livraison gratuite
          </div>
        `}
        
        <div class="summary-row">
          <span>Sous-total (${cartData.items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
          <span>${formatPrice(cartData.subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Livraison</span>
          <span>${cartData.livraison === 0 ? '<span class="text-success">Gratuite</span>' : formatPrice(cartData.livraison)}</span>
        </div>
        <div class="summary-row">
          <span>TVA (20%)</span>
          <span>${formatPrice(cartData.taxes)}</span>
        </div>
        
        <div class="coupon-form">
          <input type="text" placeholder="Code promo" id="coupon-input">
          <button class="btn btn-secondary btn-sm">Appliquer</button>
        </div>
        
        <div class="summary-row total">
          <span>Total</span>
          <span class="total-amount">${formatPrice(cartData.total)}</span>
        </div>
        
        <button class="btn btn-primary btn-block btn-lg mt-3" onclick="goToCheckout()">
          🔒 Passer la commande
        </button>
        
        <a href="products.html" class="btn btn-ghost btn-block mt-2">
          ← Continuer mes achats
        </a>
        
        <button class="btn btn-ghost btn-block btn-sm" onclick="clearCart()" style="color: var(--danger);">
          🗑️ Vider le panier
        </button>
      </div>
    </div>
  `;
}

async function updateQuantity(productId, quantity) {
  if (quantity < 1) {
    await removeItem(productId);
    return;
  }
  
  try {
    await api.put('/cart/update', { productId, quantity });
    await loadCart();
    updateCartCount();
    showToast('Panier mis à jour', 'success');
  } catch (error) {
    showToast(error.message, 'error');
    await loadCart();
  }
}

async function removeItem(productId) {
  try {
    await api.delete(`/cart/remove/${productId}`);
    await loadCart();
    updateCartCount();
    showToast('Article supprimé', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function clearCart() {
  if (!confirm('Voulez-vous vraiment vider votre panier ?')) return;
  
  try {
    await api.delete('/cart/clear');
    await loadCart();
    updateCartCount();
    showToast('Panier vidé', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function goToCheckout() {
  const unavailable = cartData.items.filter(i => !i.disponible);
  if (unavailable.length > 0) {
    showToast('Certains articles ne sont plus disponibles', 'warning');
    return;
  }
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', loadCart);