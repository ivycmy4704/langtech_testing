const supportForm = document.getElementById('supportForm');
if (supportForm) {
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    const ticket = {
      id: Date.now(),
      userId: user?.id,
      email: user?.email,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      status: 'Open',
      timestamp: new Date().toISOString()
    };

    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    tickets.push(ticket);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    alert('Ticket submitted!');
    supportForm.reset();
    window.location.href = 'dashboard.html';
  });
}
