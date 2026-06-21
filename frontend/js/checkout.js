let cartData = null;
let selectedPayment = 'carte';
let selectedShipping = 'standard';

async function initCheckout() {
  if (!requireAuth()) return;
  
  const container = document.getElementById('checkout-container');
  container.innerHTML = '<div class="text-center" style="padding: 3rem;"><div class="loader"></div></div>';
  
  try {
    const [cart, profile] = await Promise.all([
      api.get('/cart'),
      api.get('/auth/profile')
    ]);
    
    if (cart.items.length === 0) {
      window.location.href = 'cart.html';
      return;
    }
    
    cartData = cart;
    renderCheckout(profile);
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Erreur: ${error.message}</div>`;
  }
}

function renderCheckout(profile) {
  const container = document.getElementById('checkout-container');
  
  container.innerHTML = `
    <div class="checkout-steps">
      <div class="step active">
        <div class="step-number">1</div>
        <div class="step-info">
          <span class="step-label">Étape 1</span>
          <span class="step-title">Livraison</span>
        </div>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <div class="step-info">
          <span class="step-label">Étape 2</span>
          <span class="step-title">Paiement</span>
        </div>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <div class="step-info">
          <span class="step-label">Étape 3</span>
          <span class="step-title">Confirmation</span>
        </div>
      </div>
    </div>

    <form id="checkout-form">
      <div class="checkout-layout">
        <div>
          <div class="checkout-section">
            <h2>📍 Adresse de livraison</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>Prénom <span class="required">*</span></label>
                <input type="text" class="form-control" name="prenom" value="${profile.prenom || ''}" required>
              </div>
              <div class="form-group">
                <label>Nom <span class="required">*</span></label>
                <input type="text" class="form-control" name="nom" value="${profile.nom || ''}" required>
              </div>
              <div class="form-group full-width">
                <label>Téléphone <span class="required">*</span></label>
                <input type="tel" class="form-control" name="telephone" value="${profile.telephone || ''}" required>
              </div>
              <div class="form-group full-width">
                <label>Adresse <span class="required">*</span></label>
                <input type="text" class="form-control" name="rue" value="${profile.adresse?.rue || ''}" required placeholder="Numéro et nom de rue">
              </div>
              <div class="form-group full-width">
                <label>Complément d'adresse</label>
                <input type="text" class="form-control" name="complement" placeholder="Appartement, étage...">
              </div>
              <div class="form-group">
                <label>Code postal <span class="required">*</span></label>
                <input type="text" class="form-control" name="codePostal" value="${profile.adresse?.codePostal || ''}" required>
              </div>
              <div class="form-group">
                <label>Ville <span class="required">*</span></label>
                <input type="text" class="form-control" name="ville" value="${profile.adresse?.ville || ''}" required>
              </div>
              <div class="form-group full-width">
                <label>Pays <span class="required">*</span></label>
                <select class="form-control" name="pays" required>
                  <option value="France" selected>France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          <div class="checkout-section">
            <h2>🚚 Mode de livraison</h2>
            <div class="payment-methods">
              <label class="payment-method selected" onclick="selectShipping('standard', this)">
                <input type="radio" name="shipping" value="standard" checked>
                <span class="payment-method-icon">📦</span>
                <div class="payment-method-info">
                  <h4>Livraison standard</h4>
                  <p>3-5 jours ouvrés • ${cartData.sousTotal > 50 ? 'Gratuite' : '5.99€'}</p>
                </div>
              </label>
              <label class="payment-method" onclick="selectShipping('express', this)">
                <input type="radio" name="shipping" value="express">
                <span class="payment-method-icon">⚡</span>
                <div class="payment-method-info">
                  <h4>Livraison express</h4>
                  <p>24-48h • 12.99€</p>
                </div>
              </label>
            </div>
          </div>

          <div class="checkout-section">
            <h2>💳 Mode de paiement</h2>
            <div class="payment-methods">
              <label class="payment-method selected" onclick="selectPayment('carte', this)">
                <input type="radio" name="payment" value="carte" checked>
                <span class="payment-method-icon">💳</span>
                <div class="payment-method-info">
                  <h4>Carte bancaire</h4>
                  <p>Visa, Mastercard, CB - Paiement sécurisé</p>
                </div>
              </label>
              <label class="payment-method" onclick="selectPayment('paypal', this)">
                <input type="radio" name="payment" value="paypal">
                <span class="payment-method-icon">🅿️</span>
                <div class="payment-method-info">
                  <h4>PayPal</h4>
                  <p>Paiement via votre compte PayPal</p>
                </div>
              </label>
              <label class="payment-method" onclick="selectPayment('a_la_livraison', this)">
                <input type="radio" name="payment" value="a_la_livraison">
                <span class="payment-method-icon">💵</span>
                <div class="payment-method-info">
                  <h4>Paiement à la livraison</h4>
                  <p>Payez en espèces ou par CB à la réception</p>
                </div>
              </label>
            </div>
            
            <div id="card-fields" class="mt-3">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Numéro de carte</label>
                  <input type="text" class="form-control" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                <div class="form-group">
                  <label>Date d'expiration</label>
                  <input type="text" class="form-control" placeholder="MM/AA" maxlength="5">
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input type="text" class="form-control" placeholder="123" maxlength="3">
                </div>
              </div>
            </div>
          </div>

          <div class="checkout-section">
            <h2>📝 Notes (optionnel)</h2>
            <textarea class="form-control" name="notes" rows="3" placeholder="Instructions spéciales pour la livraison..."></textarea>
          </div>
        </div>

        <div>
          <div class="cart-summary">
            <h2>Votre commande</h2>
            
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
              ${cartData.items.map(item => `
                <div style="display: flex; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--gray-200);">
                  <img src="${item.image}" alt="${item.nom}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.9rem;">${item.nom}</div>
                    <div style="font-size: 0.85rem; color: var(--gray-600);">Qté: ${item.quantity}</div>
                  </div>
                  <div style="font-weight: 600;">${formatPrice(item.total)}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="summary-row">
              <span>Sous-total</span>
              <span>${formatPrice(cartData.sousTotal)}</span>
            </div>
            <div class="summary-row">
              <span>Livraison</span>
              <span id="checkout-shipping">${cartData.livraison === 0 ? 'Gratuite' : formatPrice(cartData.livraison)}</span>
            </div>
            <div class="summary-row">
              <span>TVA</span>
              <span>${formatPrice(cartData.taxes)}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span class="total-amount" id="checkout-total">${formatPrice(cartData.total)}</span>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block btn-lg mt-3" id="submit-order">
              🔒 Confirmer la commande
            </button>
            
            <p class="text-center text-muted mt-2" style="font-size: 0.85rem;">
              En confirmant, vous acceptez nos conditions générales de vente
            </p>
          </div>
        </div>
      </div>
    </form>
  `;
  
  document.getElementById('checkout-form').addEventListener('submit', submitOrder);
}

function selectPayment(method, element) {
  selectedPayment = method;
  document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  
  const cardFields = document.getElementById('card-fields');
  if (method === 'carte') {
    cardFields.style.display = 'block';
  } else {
    cardFields.style.display = 'none';
  }
}

function selectShipping(method, element) {
  selectedShipping = method;
  document.querySelectorAll('[name="shipping"]').forEach(el => {
    el.closest('.payment-method').classList.remove('selected');
  });
  element.classList.add('selected');
  
  const shippingCost = method === 'express' ? 12.99 : (cartData.sousTotal > 50 ? 0 : 5.99);
  const newTotal = cartData.sousTotal + shippingCost + cartData.taxes;
  
  document.getElementById('checkout-shipping').textContent = 
    shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost);
  document.getElementById('checkout-total').textContent = formatPrice(newTotal);
}

async function submitOrder(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  const submitBtn = document.getElementById('submit-order');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="loader" style="width: 20px; height: 20px; border-width: 3px;"></div> Traitement...';
  
  try {
    const order = await api.post('/orders', {
      adresseLivraison: {
        rue: data.rue,
        complement: data.complement,
        ville: data.ville,
        codePostal: data.codePostal,
        pays: data.pays
      },
      methodePaiement: selectedPayment,
      methodeLivraison: selectedShipping,
      notes: data.notes
    });
    
    showOrderSuccess(order);
  } catch (error) {
    showToast(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🔒 Confirmer la commande';
  }
}

function showOrderSuccess(order) {
  const container = document.getElementById('checkout-container');
  
  container.innerHTML = `
    <div class="order-success">
      <div class="success-icon">✓</div>
      <h1>Merci pour votre commande !</h1>
      <p class="text-muted">Votre commande a été enregistrée avec succès</p>
      <div class="order-number">${order.numeroCommande}</div>
      <p class="text-muted">Un email de confirmation vous a été envoyé</p>
      
      <div style="background: var(--gray-100); padding: 1.5rem; border-radius: var(--radius); margin: 2rem 0; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
        <h3 style="margin-bottom: 1rem;">📋 Récapitulatif</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="text-muted">Total payé :</span>
          <strong>${formatPrice(order.total)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="text-muted">Statut :</span>
          <strong class="text-success">${order.statut}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="text-muted">Paiement :</span>
          <strong>${order.methodePaiement}</strong>
        </div>
      </div>
      
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="order-detail.html?id=${order._id}" class="btn btn-primary">📦 Voir ma commande</a>
        <a href="orders.html" class="btn btn-secondary">📋 Mes commandes</a>
        <a href="../index.html" class="btn btn-outline">🏠 Retour à l'accueil</a>
      </div>
    </div>
  `;
  
  updateCartCount(0);
}

document.addEventListener('DOMContentLoaded', initCheckout);