// Gestion de l'état d'authentification
function updateAuthUI() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const loggedOutMenu = document.getElementById('user-menu-logged-out');
  const loggedInMenu = document.getElementById('user-menu-logged-in');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const adminLink = document.getElementById('admin-link');
  
  if (token && user.email) {
    loggedOutMenu?.classList.add('hidden');
    loggedInMenu?.classList.remove('hidden');
    if (userName) userName.textContent = `Bonjour, ${user.prenom}`;
    if (userEmail) userEmail.textContent = user.email;
    if (adminLink && user.role === 'admin') {
      adminLink.classList.remove('hidden');
      adminLink.href = 'pages/admin.html';
    }
  } else {
    loggedOutMenu?.classList.remove('hidden');
    loggedInMenu?.classList.add('hidden');
  }
}

// Menu utilisateur
function initUserMenu() {
  const userBtn = document.getElementById('user-btn');
  const userMenu = document.getElementById('user-menu');
  
  if (userBtn && userMenu) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
      }
    });
  }
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

// Inscription
async function handleRegister(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  if (data.password !== data.confirmPassword) {
    showToast('Les mots de passe ne correspondent pas', 'error');
    return;
  }
  
  if (data.password.length < 6) {
    showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
    return;
  }
  
  try {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Inscription...';
    
    const response = await api.post('/auth/register', {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: data.password,
      telephone: data.telephone
    });
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    
    showToast('Compte créé avec succès !', 'success');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  } catch (error) {
    showToast(error.message, 'error');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'S\'inscrire';
  }
}

// Connexion
async function handleLogin(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion...';
    
    const response = await api.post('/auth/login', {
      email: data.email,
      password: data.password
    });
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    
    showToast(`Bienvenue ${response.prenom} !`, 'success');
    
    const redirect = sessionStorage.getItem('redirectAfterLogin');
    if (redirect) {
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect;
    } else {
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
    }
  } catch (error) {
    showToast(error.message, 'error');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Se connecter';
  }
}

// Déconnexion
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Déconnexion réussie', 'success');
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 500);
}

// Vérification auth
function requireAuth(redirectUrl = '../pages/login.html') {
  const token = localStorage.getItem('token');
  if (!token) {
    sessionStorage.setItem('redirectAfterLogin', window.location.href);
    showToast('Veuillez vous connecter', 'warning');
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return false;
  }
  return true;
}

function requireAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role !== 'admin') {
    showToast('Accès réservé aux administrateurs', 'error');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);
    return false;
  }
  return true;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  initUserMenu();
});