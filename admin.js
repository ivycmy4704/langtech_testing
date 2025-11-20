// admin.js - Enhanced with colorful UI and complete functionality

console.log("🎯 ADMIN.JS LOADED - Colorful Edition");

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("🌈 Admin JS initialized with colorful theme");
    
    // Check if admin is authenticated and on admin page
    const isAdminAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (isAdminPage && isAdminAuthenticated) {
        // Load all admin data with a slight delay for smooth rendering
        setTimeout(() => {
            console.log("🚀 Loading admin data...");
            if (typeof renderUserStats === 'function') renderUserStats();
            if (typeof renderUsers === 'function') renderUsers();
            if (typeof renderLoginHistory === 'function') renderLoginHistory();
            if (typeof renderTickets === 'function') renderTickets();
        }, 300);
    }
});

/* ========== USER MANAGEMENT FUNCTIONS ========== */

function renderUsers() {
    console.log("🔄 Rendering users table with colorful theme...");
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const search = document.getElementById('search')?.value.toLowerCase() || '';
    const tbody = document.querySelector('#userTable tbody');
    
    if (!tbody) {
        console.error("❌ User table tbody not found!");
        return;
    }

    console.log(`📊 Total users in storage: ${users.length}`);
    console.log("👥 Users data:", users);

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: #666; font-style: italic; background: #f8f9fa; border-radius: 8px;">
                    🏢 No users registered yet. Users will appear here after they create accounts.
                </td>
            </tr>
        `;
        return;
    }

    const filteredUsers = users.filter(u => {
        const companyMatch = u.company?.toLowerCase().includes(search) || false;
        const emailMatch = u.email?.toLowerCase().includes(search) || false;
        return companyMatch || emailMatch;
    });

    console.log(`🔍 Filtered users: ${filteredUsers.length}`);

    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: #666; font-style: italic; background: #f8f9fa; border-radius: 8px;">
                    🔍 No users match your search criteria.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredUsers.map(user => `
        <tr style="transition: all 0.3s ease;">
            <td><strong>${user.company || '🏢 N/A'}</strong></td>
            <td>📧 ${user.email || 'N/A'}</td>
            <td>
                <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.875rem; font-weight: 500;">
                    🏭 ${user.industry || 'N/A'}
                </span>
            </td>
            <td>
                <input type="number" 
                       value="${user.credits || 0}" 
                       class="credit-input" 
                       data-id="${user.id}" 
                       style="width:80px; padding:8px; text-align:center; border: 2px solid #e1e5e9; border-radius: 8px; font-weight: bold; color: #667eea;"
                       min="0" 
                       max="1000"
                       onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';"
                       onblur="this.style.borderColor='#e1e5e9'; this.style.boxShadow='none';" />
            </td>
            <td>
                <span style="color: ${user.lastLogin ? '#28a745' : '#6c757d'}; font-weight: 500;">
                    🕒 ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() + ' ' + new Date(user.lastLogin).toLocaleTimeString() : 'Never logged in'}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn-sm btn-success" onclick="saveCredits(${user.id})" 
                            style="background: linear-gradient(135deg, #28a745, #20c997); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(40, 167, 69, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        💾 Save
                    </button>
                    <button class="btn-sm btn-secondary" onclick="editUser(${user.id})"
                            style="background: linear-gradient(135deg, #6c757d, #5a6268); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(108, 117, 125, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        ✏️ Edit
                    </button>
                    <button class="btn-sm btn-danger" onclick="deleteUser(${user.id})"
                            style="background: linear-gradient(135deg, #dc3545, #c82333); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(220, 53, 69, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        🗑️ Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    console.log("✅ Users table rendered successfully with colorful theme");
}

function saveCredits(id) {
    console.log(`💾 Saving credits for user ID: ${id}`);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        showNotification('❌ User not found!', 'error');
        return;
    }

    const creditInput = document.querySelector(`.credit-input[data-id="${id}"]`);
    if (!creditInput) {
        showNotification('❌ Credit input not found!', 'error');
        return;
    }

    const newCredits = parseInt(creditInput.value) || 0;
    
    if (newCredits < 0) {
        showNotification('❌ Credits cannot be negative!', 'error');
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
    
    showNotification(`✅ Credits updated to ${newCredits} for ${users[userIndex].company}`, 'success');
    console.log(`💰 Credits updated for ${users[userIndex].company}: ${newCredits}`);
    
    renderUsers();
    if (typeof renderUserStats === 'function') renderUserStats();
}

function editUser(id) {
    console.log(`✏️ Editing user ID: ${id}`);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    
    if (!user) {
        showNotification('❌ User not found!', 'error');
        return;
    }

    const newCompany = prompt('🏢 Edit Company Name:', user.company || '');
    if (newCompany === null) return; // User cancelled
    
    if (newCompany.trim() === '') {
        showNotification('❌ Company name cannot be empty!', 'error');
        return;
    }

    const newEmail = prompt('📧 Edit Email Address:', user.email || '');
    if (newEmail === null) return; // User cancelled
    
    if (newEmail.trim() === '' || !newEmail.includes('@')) {
        showNotification('❌ Please enter a valid email address!', 'error');
        return;
    }

    user.company = newCompany.trim();
    user.email = newEmail.trim();
    user.updatedAt = new Date().toISOString();
    
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('✅ User information updated successfully!', 'success');
    console.log(`👤 User updated: ${user.company} (${user.email})`);
    
    renderUsers();
}

function deleteUser(id) {
    console.log(`🗑️ Attempting to delete user ID: ${id}`);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    
    if (!user) {
        showNotification('❌ User not found!', 'error');
        return;
    }

    const confirmDelete = confirm(`⚠️ Are you sure you want to delete user:\n\n"${user.company}" (${user.email})\n\nThis action cannot be undone!`);
    
    if (!confirmDelete) {
        console.log('❌ User deletion cancelled');
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
    
    showNotification('✅ User deleted successfully!', 'success');
    console.log(`🗑️ User deleted: ${user.company} (${user.email})`);
    
    renderUsers();
    if (typeof renderUserStats === 'function') renderUserStats();
    if (typeof renderLoginHistory === 'function') renderLoginHistory();
}

/* ========== STATISTICS FUNCTIONS ========== */

function renderUserStats() {
    console.log("📈 Rendering user statistics with colorful cards...");
    
    const statsContainer = document.getElementById('userStats');
    if (!statsContainer) {
        console.error("❌ User stats container not found!");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const loginHistory = JSON.parse(localStorage.getItem('userLoginHistory') || '[]');
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    
    const totalCredits = users.reduce((sum, user) => sum + (user.credits || 0), 0);
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    console.log(`📊 Stats - Users: ${users.length}, Logins: ${loginHistory.length}, Tickets: ${tickets.length}`);

    const gradientColors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ];

    statsContainer.innerHTML = `
        <div class="stat-card" style="background: ${gradientColors[0]};">
            <span class="stat-number">👥 ${users.length}</span>
            <span class="stat-label">Total Registered Users</span>
        </div>
        <div class="stat-card" style="background: ${gradientColors[1]};">
            <span class="stat-number">🔐 ${loginHistory.length}</span>
            <span class="stat-label">Total Login Sessions</span>
        </div>
        <div class="stat-card" style="background: ${gradientColors[2]};">
            <span class="stat-number">🪙 ${totalCredits}</span>
            <span class="stat-label">Total Credits Available</span>
        </div>
        <div class="stat-card" style="background: ${gradientColors[3]};">
            <span class="stat-number">🎫 ${tickets.length}</span>
            <span class="stat-label">Total Support Tickets</span>
            <div style="font-size: 0.9rem; margin-top: 8px; opacity: 0.9;">
                <span style="color: #d4edda;">✅ ${openTickets} Open</span> | 
                <span style="color: #f8d7da;">❌ ${closedTickets} Closed</span>
            </div>
        </div>
    `;

    console.log("✅ User statistics rendered successfully with colorful cards");
}

/* ========== LOGIN HISTORY FUNCTIONS ========== */

function renderLoginHistory() {
    console.log("🔄 Rendering login history with modern design...");
    
    const historyContainer = document.getElementById('loginHistory');
    if (!historyContainer) {
        console.error("❌ Login history container not found!");
        return;
    }

    const loginHistory = JSON.parse(localStorage.getItem('userLoginHistory') || '[]');
    console.log(`📋 Login history entries: ${loginHistory.length}`);

    if (loginHistory.length === 0) {
        historyContainer.innerHTML = `
            <div style="text-align: center; color: #666; padding: 3rem; font-style: italic; background: #f8f9fa; border-radius: 12px;">
                <p>📭 No login history available yet.</p>
                <p style="font-size: 0.9rem; margin-top: 1rem;">User login sessions will appear here when users sign in.</p>
            </div>
        `;
        return;
    }

    // Sort by most recent first
    loginHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Show only last 20 logins to avoid clutter
    const recentLogins = loginHistory.slice(0, 20);
    
    historyContainer.innerHTML = recentLogins.map((login, index) => `
        <div class="history-item" style="background: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'}; border-left: 4px solid #667eea;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <strong style="color: #333;">${login.company || '🏢 Unknown Company'}</strong><br>
                    <small style="color: #666;">📧 ${login.email || 'Unknown Email'}</small>
                </div>
                <div style="text-align: right;">
                    <small style="color: #28a745; font-weight: 500;">${new Date(login.timestamp).toLocaleDateString()}</small><br>
                    <small style="color: #6c757d;">${new Date(login.timestamp).toLocaleTimeString()}</small>
                </div>
            </div>
        </div>
    `).join('');

    console.log("✅ Login history rendered successfully with modern design");
}

/* ========== SUPPORT TICKET FUNCTIONS ========== */

function renderTickets() {
    console.log("🔄 Rendering support tickets with enhanced design...");
    
    const ticketsContainer = document.getElementById('tickets');
    if (!ticketsContainer) {
        console.error("❌ Tickets container not found!");
        return;
    }

    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    console.log(`🎫 Support tickets found: ${tickets.length}`);
    console.log("📬 Tickets data:", tickets);

    if (tickets.length === 0) {
        ticketsContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: #666; font-style: italic; background: #f8f9fa; border-radius: 12px;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">📭 No support tickets available yet</p>
                <p style="font-size: 0.9rem;">Support tickets will appear here when users submit requests from the login or register pages.</p>
                <p style="font-size: 0.8rem; margin-top: 2rem; color: #999;">💡 Tip: Try submitting a support ticket from the main login page to test this feature!</p>
            </div>
        `;
        return;
    }

    // Sort by most recent first
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    ticketsContainer.innerHTML = tickets.map(ticket => {
        const statusColor = ticket.status === 'open' ? '#28a745' : ticket.status === 'closed' ? '#dc3545' : '#ffc107';
        const statusEmoji = ticket.status === 'open' ? '🔓' : ticket.status === 'closed' ? '🔒' : '⏳';
        
        return `
        <div class="ticket-item" style="border-left: 4px solid ${statusColor};">
            <div class="ticket-header">
                <strong>${ticket.company || '👤 Guest User'} - ${ticket.subject}</strong>
                <span class="ticket-status status-${ticket.status || 'open'}" 
                      style="background: ${statusColor}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">
                    ${statusEmoji} ${(ticket.status || 'open').toUpperCase()}
                </span>
            </div>
            <div style="margin-bottom: 0.5rem;">
                <strong>📧 From:</strong> ${ticket.email || 'Email not provided'}
            </div>
            <div class="ticket-message">
                <strong>💬 Message:</strong><br>
                <div style="margin-top: 0.5rem; line-height: 1.5; color: #333;">
                    ${ticket.message}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e1e5e9;">
                <small style="color: #666;">
                    📅 Submitted: ${new Date(ticket.createdAt).toLocaleString()}
                    ${ticket.updatedAt ? `<br>✏️ Updated: ${new Date(ticket.updatedAt).toLocaleString()}` : ''}
                </small>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-sm btn-success" onclick="updateTicketStatus('${ticket.id}', 'closed')" 
                            ${ticket.status === 'closed' ? 'disabled' : ''}
                            style="background: linear-gradient(135deg, #28a745, #20c997); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(40, 167, 69, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        ✅ Close
                    </button>
                    <button class="btn-sm btn-secondary" onclick="updateTicketStatus('${ticket.id}', 'open')" 
                            ${ticket.status === 'open' ? 'disabled' : ''}
                            style="background: linear-gradient(135deg, #6c757d, #5a6268); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(108, 117, 125, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        🔄 Reopen
                    </button>
                    <button class="btn-sm btn-danger" onclick="deleteTicket('${ticket.id}')"
                            style="background: linear-gradient(135deg, #dc3545, #c82333); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(220, 53, 69, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    console.log("✅ Support tickets rendered successfully with enhanced design");
}

function updateTicketStatus(ticketId, status) {
    console.log(`🔄 Updating ticket ${ticketId} to status: ${status}`);
    
    let tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
        showNotification('❌ Ticket not found!', 'error');
        return;
    }

    const oldStatus = tickets[ticketIndex].status;
    tickets[ticketIndex].status = status;
    tickets[ticketIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    
    showNotification(`✅ Ticket status updated from "${oldStatus}" to "${status}"`, 'success');
    console.log(`🎫 Ticket ${ticketId} status updated to: ${status}`);
    
    renderTickets();
    if (typeof renderUserStats === 'function') renderUserStats();
}

function deleteTicket(ticketId) {
    console.log(`🗑️ Attempting to delete ticket: ${ticketId}`);
    
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
        showNotification('❌ Ticket not found!', 'error');
        return;
    }

    const confirmDelete = confirm(`⚠️ Are you sure you want to delete this support ticket?\n\nSubject: ${ticket.subject}\nFrom: ${ticket.company || 'Guest'}\n\nThis action cannot be undone!`);
    
    if (!confirmDelete) {
        console.log('❌ Ticket deletion cancelled');
        return;
    }

    const updatedTickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));
    
    showNotification('✅ Support ticket deleted successfully!', 'success');
    console.log(`🗑️ Ticket deleted: ${ticket.subject}`);
    
    renderTickets();
    if (typeof renderUserStats === 'function') renderUserStats();
}

/* ========== UTILITY FUNCTIONS ========== */

// Beautiful notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' :
                   type === 'error' ? 'linear-gradient(135deg, #dc3545, #c82333)' :
                   'linear-gradient(135deg, #17a2b8, #6f42c1)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // Animate out after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Refresh all admin data
function refreshAdminData() {
    console.log("🔄 Refreshing all admin data with colorful theme...");
    
    if (typeof renderUserStats === 'function') renderUserStats();
    if (typeof renderUsers === 'function') renderUsers();
    if (typeof renderLoginHistory === 'function') renderLoginHistory();
    if (typeof renderTickets === 'function') renderTickets();
    
    showNotification('🔄 Admin data refreshed successfully!', 'success');
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    const isAdminAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (isAdminPage && isAdminAuthenticated) {
        console.log("🔄 Auto-refreshing admin data...");
        if (typeof renderUserStats === 'function') renderUserStats();
        if (typeof renderTickets === 'function') renderTickets();
    }
}, 30000);

/* ========== EXPORT FUNCTIONS FOR GLOBAL ACCESS ========== */

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
    window.showNotification = showNotification;
}

console.log("🎉 Colorful Admin JS functions loaded and ready! 🚀");
