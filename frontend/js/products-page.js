let currentPage = 1;
let currentFilters = {};

async function loadProducts(page = 1) {
  currentPage = page;
  const grid = document.getElementById('products-grid');
  const paginationContainer = document.getElementById('pagination-container');
  
  // Afficher skeleton
  grid.innerHTML = Array(8).fill(0).map(() => `
    <div class="product-card">
      <div class="skeleton skeleton-image"></div>
      <div class="product-content">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-title"></div>
      </div>
    </div>
  `).join('');

  try {
    let queryString = `?page=${page}`;
    
    Object.keys(currentFilters).forEach(key => {
      if (currentFilters[key]) {
        queryString += `&${key}=${encodeURIComponent(currentFilters[key])}`;
      }
    });

    const data = await api.get(`/products${queryString}`);
    
    document.getElementById('results-count').textContent = data.total;
    
    if (data.products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">🔍</div>
          <h2>Aucun produit trouvé</h2>
          <p>Essayez de modifier vos filtres ou votre recherche</p>
          <button class="btn btn-primary" onclick="resetFilters()">Réinitialiser les filtres</button>
        </div>
      `;
      paginationContainer.innerHTML = '';
      return;
    }
    
    grid.innerHTML = data.products.map(p => createProductCard(p)).join('');
    paginationContainer.innerHTML = createPagination(data.page, data.pages, 'loadProducts');
    
    initScrollReveal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    grid.innerHTML = `<p class="text-center text-muted">Erreur: ${error.message}</p>`;
  }
}

function resetFilters() {
  currentFilters = {};
  document.querySelectorAll('input[name="categorie"]').forEach(el => el.checked = el.value === '');
  document.getElementById('prix-min').value = '';
  document.getElementById('prix-max').value = '';
  document.getElementById('filter-promo').checked = false;
  document.getElementById('filter-new').checked = false;
  document.getElementById('filter-in-stock').checked = false;
  document.getElementById('sort-select').value = 'recent';
  loadProducts(1);
}

function initFilters() {
  // Catégories
  document.querySelectorAll('input[name="categorie"]').forEach(el => {
    el.addEventListener('change', (e) => {
      if (e.target.value) {
        currentFilters.categorie = e.target.value;
      } else {
        delete currentFilters.categorie;
      }
      loadProducts(1);
    });
  });

  // Prix
  document.getElementById('apply-price-filter').addEventListener('click', () => {
    const min = document.getElementById('prix-min').value;
    const max = document.getElementById('prix-max').value;
    if (min) currentFilters.prixMin = min;
    else delete currentFilters.prixMin;
    if (max) currentFilters.prixMax = max;
    else delete currentFilters.prixMax;
    loadProducts(1);
  });

  // Options
  document.getElementById('filter-promo').addEventListener('change', (e) => {
    if (e.target.checked) currentFilters.enPromo = 'true';
    else delete currentFilters.enPromo;
    loadProducts(1);
  });

  document.getElementById('filter-new').addEventListener('change', (e) => {
    if (e.target.checked) currentFilters.nouveau = 'true';
    else delete currentFilters.nouveau;
    loadProducts(1);
  });

  // Tri
  document.getElementById('sort-select').addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    loadProducts(1);
  });

  // Reset
  document.getElementById('reset-filters').addEventListener('click', resetFilters);

  // Mobile filter
  const mobileFilterBtn = document.getElementById('mobile-filter-btn');
  const filtersSidebar = document.getElementById('filters-sidebar');
  const overlay = document.getElementById('overlay');
  
  if (mobileFilterBtn) {
    mobileFilterBtn.addEventListener('click', () => {
      filtersSidebar.classList.add('active');
      overlay.classList.add('active');
    });
    
    overlay.addEventListener('click', () => {
      filtersSidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // URL params
  const params = getUrlParams();
  if (params.categorie) {
    currentFilters.categorie = params.categorie;
    const radio = document.querySelector(`input[name="categorie"][value="${params.categorie}"]`);
    if (radio) radio.checked = true;
    
    document.getElementById('page-title').textContent = formatCategory(params.categorie);
    document.getElementById('breadcrumb-title').textContent = formatCategory(params.categorie);
  }
  if (params.keyword) {
    currentFilters.keyword = params.keyword;
    document.getElementById('page-title').textContent = `Résultats pour "${params.keyword}"`;
    document.getElementById('search-input').value = params.keyword;
  }
  if (params.enPromo === 'true') {
    currentFilters.enPromo = 'true';
    document.getElementById('filter-promo').checked = true;
    document.getElementById('page-title').textContent = '🔥 Promotions';
  }
  if (params.nouveau === 'true') {
    currentFilters.nouveau = 'true';
    document.getElementById('filter-new').checked = true;
    document.getElementById('page-title').textContent = '✨ Nouveautés';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  loadProducts(1);
});