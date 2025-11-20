function renderUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const search = document.getElementById('search').value.toLowerCase();
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = '';

  users.filter(u => u.company.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)).forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.company}</td>
      <td>${user.email}</td>
      <td>${user.industry}</td>
      <td><input type="number" value="${user.credits}" class="credit-input" data-id="${user.id}" style="width:60px;" /></td>
      <td>
        <button class="btn-sm btn-success" onclick="saveCredits(${user.id})">Save</button>
        <button class="btn-sm btn-secondary" onclick="editUser(${user.id})">Edit</button>
        <button class="btn-sm" style="background:var(--danger);color:white;" onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveCredits(id) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    const creditInput = document.querySelector(`.credit-input[data-id="${id}"]`);
    const newCredits = parseInt(creditInput.value) || 0;
    users[userIndex].credits = newCredits;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Credits saved successfully!');
    renderUsers();
  }
}

function editUser(id) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === id);
  
  if (user) {
    const newCompany = prompt('Edit Company Name:', user.company);
    if (newCompany !== null) {
      user.company = newCompany.trim();
      localStorage.setItem('users', JSON.stringify(users));
      renderUsers();
    }
  }
}

function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
  }
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', function() {
  // Check if admin is authenticated
  const isAdminAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
  
  if (isAdminAuthenticated && window.location.pathname.includes('admin.html')) {
    // Load all data
    renderUsers();
    
    // Load login history if function exists
    if (typeof renderLoginHistory === 'function') {
      renderLoginHistory();
    }
    
    // Load tickets if function exists  
    if (typeof renderTickets === 'function') {
      renderTickets();
    }
  }
});

// Render tickets function for admin.js compatibility
function renderTickets() {
  const ticketsDiv = document.getElementById('tickets');
  const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
  
  if (tickets.length === 0) {
    ticketsDiv.innerHTML = '<p>No support tickets available.</p>';
    return;
  }

  ticketsDiv.innerHTML = tickets.map(ticket => `
    <div class="ticket-item">
      <div class="ticket-header">
        <strong>${ticket.company} - ${ticket.subject}</strong>
        <span class="ticket-status status-${ticket.status}">${ticket.status}</span>
      </div>
      <div><strong>From:</strong> ${ticket.email}</div>
      <div class="ticket-message">
        <strong>Message:</strong><br>${ticket.message}
      </div>
      <div><small>Submitted: ${new Date(ticket.createdAt).toLocaleString()}</small></div>
    </div>
  `).join('');
}

// Initial render
if (typeof renderUsers === 'function') {
  renderUsers();
}
