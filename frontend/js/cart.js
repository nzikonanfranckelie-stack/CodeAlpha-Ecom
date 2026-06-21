// Ajouter au panier
async function addToCart(productId, quantity = 1) {
  const token = localStorage.getItem('token');
  if (!token) {
    sessionStorage.setItem('redirectAfterLogin', window.location.href);
    showToast('Connectez-vous pour ajouter au panier', 'warning');
    setTimeout(() => {
      window.location.href = 'pages/login.html';
    }, 1500);
    return;
  }
  
  try {
    const response = await api.post('/cart/add', { productId, quantity });
    updateCartCount(response.cartCount);
    showToast('Produit ajouté au panier !', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Mettre à jour le compteur
async function updateCartCount(count = null) {
  const cartCountElements = document.querySelectorAll('#cart-count');
  
  if (count !== null) {
    cartCountElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    return;
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    cartCountElements.forEach(el => el.style.display = 'none');
    return;
  }
  
  try {
    const data = await api.get('/cart/count');
    cartCountElements.forEach(el => {
      el.textContent = data.count;
      el.style.display = data.count > 0 ? 'flex' : 'none';
    });
  } catch (error) {
    console.error('Erreur compteur panier:', error);
  }
}

// Wishlist
async function toggleWishlist(productId, button) {
  const token = localStorage.getItem('token');
  if (!token) {
    showToast('Connectez-vous pour ajouter aux favoris', 'warning');
    return;
  }
  
  try {
    const isInWishlist = button.classList.contains('active');
    
    if (isInWishlist) {
      await api.delete(`/wishlist/remove/${productId}`);
      button.classList.remove('active');
      button.textContent = '♡';
      showToast('Retiré des favoris', 'info');
    } else {
      await api.post('/wishlist/add', { productId });
      button.classList.add('active');
      button.textContent = '❤️';
      showToast('Ajouté aux favoris !', 'success');
    }
    
    updateWishlistCount();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function updateWishlistCount() {
  const token = localStorage.getItem('token');
  const wishlistCountElements = document.querySelectorAll('#wishlist-count');
  
  if (!token) {
    wishlistCountElements.forEach(el => el.style.display = 'none');
    return;
  }
  
  try {
    const wishlist = await api.get('/wishlist');
    const count = wishlist.length;
    wishlistCountElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  } catch (error) {
    console.error('Erreur compteur wishlist:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateWishlistCount();
});