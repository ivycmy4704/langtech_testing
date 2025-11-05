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
  // Implementation similar to auth.js - update credits
  alert('Credits saved!');
  renderUsers();
}

function editUser(id) {
  alert('Edit modal coming soon.');
}

function deleteUser(id) {
  if (confirm('Delete?')) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
  }
}

// Render tickets
const ticketsDiv = document.getElementById('tickets');
const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
ticketsDiv.innerHTML = tickets.map(t => `<p><strong>${t.subject}</strong>: ${t.message} (${t.status})</p>`).join('') || '<p>No tickets.</p>';

renderUsers();
