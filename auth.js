// Auth & Credits Management
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function updateCreditDisplay() {
  const user = getCurrentUser();
  const el = document.getElementById('creditDisplay');
  if (el && user) el.textContent = `Credits: ${user.credits || 0}`;
}

function deductCredits(amount) {
  const user = getCurrentUser();
  if (user && user.credits >= amount) {
    user.credits -= amount;
    localStorage.setItem('currentUser', JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx > -1) users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));
    updateCreditDisplay();
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value.trim().toUpperCase();
    const pending = localStorage.getItem('pendingCode');
    const tempUser = JSON.parse(localStorage.getItem('tempUser') || '{}');

    if (code === pending && tempUser.email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let user = users.find(u => u.email === tempUser.email);
      if (!user) {
        user = { ...tempUser, code, id: Date.now(), credits: 20 };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.removeItem('pendingCode');
      localStorage.removeItem('tempUser');
      window.location.href = 'questionnaire.html';
    } else {
      alert('Invalid code.');
    }
  });
}

updateCreditDisplay();
