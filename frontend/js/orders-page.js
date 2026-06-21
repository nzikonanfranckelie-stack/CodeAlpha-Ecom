const STATUS_CONFIG = {
  en_attente: { color: '#f59e0b', icon: '⏳', label: 'En attente' },
  payee: { color: '#10b981', icon: '✅', label: 'Payée' },
  preparee: { color: '#3b82f6', icon: '📦', label: 'Préparée' },
  expediee: { color: '#6366f1', icon: '🚚', label: 'Expédiée' },
  livree: { color: '#10b981', icon: '✓', label: 'Livrée' },
  annulee: { color: '#ef4444', icon: '✕', label: 'Annulée' }
};

async function loadOrders() {
  if (!requireAuth()) return;
  
  const container = document.getElementById('orders-container');
  container.innerHTML = '<div class="text-center" style="padding: 3rem;"><div class="loader"></div></div>';
  
  try {
    const data = await api.get('/orders');
    
    if (data.orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h2>Aucune commande</h2>
          <p>Vous n'avez pas encore passé de commande</p>
          <a href="products.html" class="btn btn-primary">Commencer mes achats</a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = data.orders.map(order => {
      const status = STATUS_CONFIG[order.statut] || STATUS_CONFIG.en_attente;
      return `
        <div class="checkout-section">
          <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <div style="font-size: 0.875rem; color: var(--gray-600);">Commande du ${formatDate(order.createdAt)}</div>
              <div style="font-family: monospace; font-weight: 700; font-size: 1.1rem; color: var(--primary);">${order.numeroCommande}</div>
            </div>
            <div style="text-align: right;">
              <span style="display: inline-block; padding: 0.5rem 1rem; background: ${status.color}20; color: ${status.color}; border-radius: var(--radius-full); font-weight: 600; font-size: 0.875rem;">
                ${status.icon} ${status.label}
              </span>
              <div style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem; color: var(--gray-900);">${formatPrice(order.total)}</div>
            </div>
          </div>
          
          <div style="display: grid; gap: 0.75rem; margin-bottom: 1rem;">
            ${order.items.slice(0, 3).map(item => `
              <div style="display: flex; gap: 1rem; align-items: center; padding: 0.5rem; background: var(--gray-100); border-radius: var(--radius-sm);">
                <img src="${item.image}" alt="${item.nom}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);">
                <div style="flex: 1;">
                  <div style="font-weight: 600;">${item.nom}</div>
                  <div style="font-size: 0.85rem; color: var(--gray-600);">Qté: ${item.quantite} × ${formatPrice(item.prixUnitaire)}</div>
                </div>
                <div style="font-weight: 600;">${formatPrice(item.total)}</div>
              </div>
            `).join('')}
            ${order.items.length > 3 ? `<div class="text-muted text-center">+ ${order.items.length - 3} autre(s) article(s)</div>` : ''}
          </div>
          
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="order-detail.html?id=${order._id}" class="btn btn-sm btn-primary">Voir les détails</a>
            ${['en_attente', 'payee'].includes(order.statut) ? `
              <button class="btn btn-sm btn-danger" onclick="cancelOrder('${order._id}')">Annuler</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Erreur: ${error.message}</div>`;
  }
}

async function cancelOrder(orderId) {
  if (!confirm('Voulez-vous vraiment annuler cette commande ?')) return;
  
  try {
    await api.post(`/orders/${orderId}/cancel`);
    showToast('Commande annulée', 'success');
    loadOrders();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', loadOrders);