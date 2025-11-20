// admin.js - Enhanced with complete user management and support ticket system

console.log("=== ADMIN.JS LOADED ===");

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Admin JS initialized");
    
    // Check if admin is authenticated and on admin page
    const isAdminAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (isAdminPage && isAdminAuthenticated) {
        // Load all admin data
        setTimeout(() => {
            if (typeof renderUserStats === 'function') renderUserStats();
            if (typeof renderUsers === 'function') renderUsers();
            if (typeof renderLoginHistory === 'function') renderLoginHistory();
            if (typeof renderTickets === 'function') renderTickets();
        }, 200);
    }
});

/* ========== USER MANAGEMENT FUNCTIONS ========== */

function renderUsers() {
    console.log("🔄 Rendering users table...");
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const search = document.getElementById('search')?.value.toLowerCase() || '';
    const tbody = document.querySelector('#userTable tbody');
    
    if (!tbody) {
        console.error("User table tbody not found!");
        return;
    }

    console.log(`📊 Total users in storage: ${users.length}`);
    console.log("Users data:", users);

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #666;">No users registered yet. Users will appear here after they create accounts.</td></tr>';
        return;
    }

    const filteredUsers = users.filter(u => {
        const companyMatch = u.company?.toLowerCase().includes(search) || false;
        const emailMatch = u.email?.toLowerCase().includes(search) || false;
        return companyMatch || emailMatch;
    });

    console.log(`🔍 Filtered users: ${filteredUsers.length}`);

    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #666;">No users match your search criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td><strong>${user.company || 'N/A'}</strong></td>
            <td>${user.email || 'N/A'}</td>
            <td><span class="industry-tag">${user.industry || 'N/A'}</span></td>
            <td>
                <input type="number" 
                       value="${user.credits || 0}" 
                       class="credit-input" 
                       data-id="${user.id}" 
                       style="width:70px; padding:4px; text-align:center;"
                       min="0" 
                       max="1000" />
            </td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() + ' ' + new Date(user.lastLogin).toLocaleTimeString() : 'Never logged in'}</td>
            <td>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button class="btn-sm btn-success" onclick="saveCredits(${user.id})" title="Save Credits">💾 Save</button>
                    <button class="btn-sm btn-secondary" onclick="editUser(${user.id})" title="Edit User">✏️ Edit</button>
                    <button class="btn-sm btn-danger" onclick="deleteUser(${user.id})" title="Delete User">🗑️ Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    console.log("✅ Users table rendered successfully");
}

function saveCredits(id) {
    console.log(`💾 Saving credits for user ID: ${id}`);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        alert('User not found!');
        return;
    }

    const creditInput = document.querySelector(`.credit-input[data-id="${id}"]`);
    if (!creditInput) {
        alert('Credit input not found!');
        return;
    }

    const newCredits = parseInt(creditInput.value) || 0;
    
    if (newCredits < 0) {
        alert('Credits cannot be negative!');
        creditInput.value = users[userIndex].credits || 0;
        return;
    }

    users[userIndex].credits = newCredits;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user session if this user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.id === id) {
        currentUser.credits = newCredits;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    alert(`✅ Credits updated to ${newCredits} for ${users[userIndex].company}`);
    console.log(`Credits updated for ${users[userIndex].company}: ${newCredits}`);
    
    renderUsers();
    if (typeof renderUserStats === 'function') renderUserStats();
}

function editUser(id) {
    console.log(`✏️ Editing user ID: ${id}`);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    
    if (!user) {
        alert('User not found!');
        return;
    }

    const newCompany = prompt('Edit Company Name:', user.company || '');
    if (newCompany === null) return; // User cancelled
    
    if (newCompany.trim() === '') {
        alert('Company name cannot be empty!');
        return;
    }

    const newEmail = prompt('Edit Email Address:', user.email || '');
    if (newEmail === null) return; // User cancelled
    
    if (newEmail.trim() === '' || !newEmail.includes('@')) {
        alert('Please enter a valid email address!');
        return;
    }

    user.company = newCompany.trim();
    user.email = newEmail.trim();
    user.updatedAt = new Date().toISOString();
    
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('✅ User information updated successfully!');
    console.log(`User updated: ${user.company} (${user.email})`);
    
    renderUsers();
}

function deleteUser(id) {
    console.log(`🗑️ Attempting to delete user ID: ${id}`);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    
    if (!user) {
        alert('User not found!');
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete user:\n\n"${user.company}" (${user.email})\n\nThis action cannot be undone!`);
    
    if (!confirmDelete) {
        console.log('User deletion cancelled');
        return;
    }

    // Remove user from users array
    const updatedUsers = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Also remove from currentUser if this user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.id === id) {
        localStorage.removeItem('currentUser');
    }
    
    alert('✅ User deleted successfully!');
    console.log(`User deleted: ${user.company} (${user.email})`);
    
    renderUsers();
    if (typeof renderUserStats === 'function') renderUserStats();
    if (typeof renderLoginHistory === 'function') renderLoginHistory();
}

/* ========== STATISTICS FUNCTIONS ========== */

function renderUserStats() {
    console.log("📈 Rendering user statistics...");
    
    const statsContainer = document.getElementById('userStats');
    if (!statsContainer) {
        console.error("User stats container not found!");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const loginHistory = JSON.parse(localStorage.getItem('userLoginHistory') || '[]');
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    
    const totalCredits = users.reduce((sum, user) => sum + (user.credits || 0), 0);
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    console.log(`Stats - Users: ${users.length}, Logins: ${loginHistory.length}, Tickets: ${tickets.length}`);

    statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-number">${users.length}</span>
            <span class="stat-label">Total Registered Users</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${loginHistory.length}</span>
            <span class="stat-label">Total Login Sessions</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${totalCredits}</span>
            <span class="stat-label">Total Credits Available</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${tickets.length}</span>
            <span class="stat-label">Total Support Tickets</span>
            <div style="font-size: 0.8rem; margin-top: 5px;">
                <span style="color: #28a745;">${openTickets} Open</span> | 
                <span style="color: #dc3545;">${closedTickets} Closed</span>
            </div>
        </div>
    `;

    console.log("✅ User statistics rendered successfully");
}

/* ========== LOGIN HISTORY FUNCTIONS ========== */

function renderLoginHistory() {
    console.log("🔄 Rendering login history...");
    
    const historyContainer = document.getElementById('loginHistory');
    if (!historyContainer) {
        console.error("Login history container not found!");
        return;
    }

    const loginHistory = JSON.parse(localStorage.getItem('userLoginHistory') || '[]');
    console.log(`📋 Login history entries: ${loginHistory.length}`);

    if (loginHistory.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No login history available. User logins will appear here when users sign in.</p>';
        return;
    }

    // Sort by most recent first
    loginHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Show only last 20 logins to avoid clutter
    const recentLogins = loginHistory.slice(0, 20);
    
    historyContainer.innerHTML = recentLogins.map(login => `
        <div class="history-item">
            <div style="display: flex; justify-content: between; align-items: start;">
                <div style="flex: 1;">
                    <strong>${login.company || 'Unknown Company'}</strong><br>
                    <small>${login.email || 'Unknown Email'}</small>
                </div>
                <div style="text-align: right;">
                    <small style="color: #666;">${new Date(login.timestamp).toLocaleDateString()}</small><br>
                    <small style="color: #999;">${new Date(login.timestamp).toLocaleTimeString()}</small>
                </div>
            </div>
        </div>
    `).join('');

    console.log("✅ Login history rendered successfully");
}

/* ========== SUPPORT TICKET FUNCTIONS ========== */

function renderTickets() {
    console.log("🔄 Rendering support tickets...");
    
    const ticketsContainer = document.getElementById('tickets');
    if (!ticketsContainer) {
        console.error("Tickets container not found!");
        return;
    }

    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    console.log(`🎫 Support tickets found: ${tickets.length}`);

    if (tickets.length === 0) {
        ticketsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No support tickets available. User support requests will appear here.</p>';
        return;
    }

    // Sort by most recent first
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    ticketsContainer.innerHTML = tickets.map(ticket => `
        <div class="ticket-item">
            <div class="ticket-header">
                <strong>${ticket.company || 'Guest User'} - ${ticket.subject}</strong>
                <span class="ticket-status status-${ticket.status || 'open'}">${(ticket.status || 'open').toUpperCase()}</span>
            </div>
            <div><strong>From:</strong> ${ticket.email || 'Email not provided'}</div>
            <div class="ticket-message">
                <strong>Message:</strong><br>${ticket.message}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <small style="color: #666;">Submitted: ${new Date(ticket.createdAt).toLocaleString()}</small>
                <div style="display: flex; gap: 5px;">
                    <button class="btn-sm btn-success" onclick="updateTicketStatus('${ticket.id}', 'closed')" ${ticket.status === 'closed' ? 'disabled' : ''}>✓ Close</button>
                    <button class="btn-sm btn-secondary" onclick="updateTicketStatus('${ticket.id}', 'open')" ${ticket.status === 'open' ? 'disabled' : ''}>↻ Reopen</button>
                    <button class="btn-sm btn-danger" onclick="deleteTicket('${ticket.id}')">🗑️ Delete</button>
                </div>
            </div>
        </div>
    `).join('');

    console.log("✅ Support tickets rendered successfully");
}

function updateTicketStatus(ticketId, status) {
    console.log(`🔄 Updating ticket ${ticketId} to status: ${status}`);
    
    let tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
        alert('Ticket not found!');
        return;
    }

    const oldStatus = tickets[ticketIndex].status;
    tickets[ticketIndex].status = status;
    tickets[ticketIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    
    alert(`✅ Ticket status updated from "${oldStatus}" to "${status}"`);
    console.log(`Ticket ${ticketId} status updated to: ${status}`);
    
    renderTickets();
    if (typeof renderUserStats === 'function') renderUserStats();
}

function deleteTicket(ticketId) {
    console.log(`🗑️ Attempting to delete ticket: ${ticketId}`);
    
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
        alert('Ticket not found!');
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete this support ticket?\n\nSubject: ${ticket.subject}\nFrom: ${ticket.company || 'Guest'}\n\nThis action cannot be undone!`);
    
    if (!confirmDelete) {
        console.log('Ticket deletion cancelled');
        return;
    }

    const updatedTickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));
    
    alert('✅ Support ticket deleted successfully!');
    console.log(`Ticket deleted: ${ticket.subject}`);
    
    renderTickets();
    if (typeof renderUserStats === 'function') renderUserStats();
}

/* ========== UTILITY FUNCTIONS ========== */

// Refresh all admin data
function refreshAdminData() {
    console.log("🔄 Refreshing all admin data...");
    
    if (typeof renderUserStats === 'function') renderUserStats();
    if (typeof renderUsers === 'function') renderUsers();
    if (typeof renderLoginHistory === 'function') renderLoginHistory();
    if (typeof renderTickets === 'function') renderTickets();
    
    alert('✅ Admin data refreshed!');
}

// Export functions for global access
if (typeof window !== 'undefined') {
    window.renderUsers = renderUsers;
    window.saveCredits = saveCredits;
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.renderUserStats = renderUserStats;
    window.renderLoginHistory = renderLoginHistory;
    window.renderTickets = renderTickets;
    window.updateTicketStatus = updateTicketStatus;
    window.deleteTicket = deleteTicket;
    window.refreshAdminData = refreshAdminData;
}

console.log("✅ Admin JS functions loaded and ready!");
