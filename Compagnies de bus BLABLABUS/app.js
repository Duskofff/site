// app.js - Gestion de la navigation, de l'authentification et des avis
// (Le code sera ajouté au fur et à mesure des étapes) 

// --- Authentification ---
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'home.html';
}

// Affichage dynamique des liens auth dans le header
function updateAuthLinks() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    if (loginLink && registerLink && logoutLink) {
        if (user) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            logoutLink.style.display = '';
            logoutLink.onclick = (e) => { e.preventDefault(); logout(); };
        } else {
            loginLink.style.display = '';
            registerLink.style.display = '';
            logoutLink.style.display = 'none';
        }
    }
}
document.addEventListener('DOMContentLoaded', updateAuthLinks);

// --- Inscription ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        let users = getUsers();
        if (users.find(u => u.username === username || u.email === email)) {
            alert('Ce nom d\'utilisateur ou cet email existe déjà.');
            return;
        }
        const user = { username, email, password };
        users.push(user);
        setUsers(users);
        setCurrentUser(user);
        window.location.href = 'home.html';
    });
}

// --- Connexion ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const loginUser = document.getElementById('loginUser').value.trim();
        const loginPassword = document.getElementById('loginPassword').value;
        let users = getUsers();
        const user = users.find(u => (u.username === loginUser || u.email === loginUser) && u.password === loginPassword);
        if (!user) {
            alert('Identifiants incorrects.');
            return;
        }
        setCurrentUser(user);
        window.location.href = 'home.html';
    });
}

// --- Forum/Avis ---
function getReviews() {
    return JSON.parse(localStorage.getItem('reviews') || '[]');
}
function setReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}
function renderReviews() {
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    if (!reviewsDisplay) return;
    const reviews = getReviews();
    if (reviews.length === 0) {
        reviewsDisplay.innerHTML = '<p style="color:#6b7280;">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>';
        return;
    }
    reviewsDisplay.innerHTML = reviews.map(r => `
        <div class="review-item">
            <div class="review-header">
                <h4 class="reviewer-name">${r.username}</h4>
                <div class="review-stars">${'★'.repeat(r.rating)}</div>
            </div>
            <p class="review-text">${r.text}</p>
            <p class="review-date">${r.date}</p>
        </div>
    `).join('');
}
function setupReviewForm() {
    const user = getCurrentUser();
    const formContainer = document.getElementById('reviewFormContainer');
    if (formContainer) {
        formContainer.style.display = user ? '' : 'none';
    }
    if (!user) return;
    let selectedRating = 5;
    const stars = document.querySelectorAll('#ratingInput .star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < 5; i++) {
                if (5-i <= selectedRating) stars[i].classList.add('active');
            }
        });
    });
    // Par défaut, activer toutes les étoiles
    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < 5; i++) stars[i].classList.add('active');
    const submitBtn = document.getElementById('submitReview');
    if (submitBtn) {
        submitBtn.onclick = function() {
            const text = document.getElementById('reviewText').value.trim();
            if (!text) {
                alert('Merci de saisir un avis.');
                return;
            }
            const reviews = getReviews();
            const date = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
            reviews.unshift({ username: user.username, rating: selectedRating, text, date });
            setReviews(reviews);
            document.getElementById('reviewText').value = '';
            renderReviews();
        };
    }
}
document.addEventListener('DOMContentLoaded', function() {
    renderReviews();
    setupReviewForm();
}); 