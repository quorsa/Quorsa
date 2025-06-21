
// Admin panel functionality
let adminCurrentUser = JSON.parse(localStorage.getItem('quorsa_current_user'));

// Initialize admin panel
window.addEventListener('load', () => {
  if (!adminCurrentUser || adminCurrentUser.role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }
  
  updateAdminDashboard();
  showSection('dashboard');
});

function updateAdminDashboard() {
  const users = JSON.parse(localStorage.getItem('quorsa_users')) || {};
  const businesses = JSON.parse(localStorage.getItem('quorsa_businesses')) || {};
  
  const totalUsers = Object.keys(users).length + Object.keys(businesses).length;
  let totalTransactions = 0;
  let totalVolume = 0;
  
  // Calculate totals from all users
  Object.values(users).forEach(user => {
    if (user.transactions) {
      totalTransactions += user.transactions.length;
      user.transactions.forEach(tx => {
        totalVolume += tx.amount || 0;
      });
    }
  });
  
  Object.values(businesses).forEach(business => {
    if (business.transactions) {
      totalTransactions += business.transactions.length;
      business.transactions.forEach(tx => {
        totalVolume += tx.amount || 0;
      });
    }
  });
  
  document.getElementById('totalUsers').textContent = totalUsers;
  document.getElementById('adminTotalTransactions').textContent = totalTransactions;
  document.getElementById('totalVolume').textContent = totalVolume.toFixed(2);
  document.getElementById('activeSessions').textContent = '1'; // Simplified
}

// Navigation
window.showSection = (sectionName) => {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Remove active class from all nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionName).style.display = 'block';
  
  // Add active class to clicked button
  event.target.classList.add('active');
  
  // Load section-specific data
  switch(sectionName) {
    case 'users':
      loadUsers();
      break;
    case 'transactions':
      loadAllTransactions();
      break;
    case 'analytics':
      loadAnalytics();
      break;
    case 'settings':
      loadSettings();
      break;
  }
}

function loadUsers() {
  const users = JSON.parse(localStorage.getItem('quorsa_users')) || {};
  const businesses = JSON.parse(localStorage.getItem('quorsa_businesses')) || {};
  const userTable = document.getElementById('userTable');
  
  userTable.innerHTML = `
    <div class="user-header">
      <span>Email</span>
      <span>Type</span>
      <span>Balance</span>
      <span>Transactions</span>
      <span>Actions</span>
    </div>
  `;
  
  // Add individual users
  Object.values(users).forEach(user => {
    const userRow = document.createElement('div');
    userRow.className = 'user-row';
    userRow.innerHTML = `
      <span>${user.email}</span>
      <span>Individual</span>
      <span>₹${user.balance}</span>
      <span>${user.transactions ? user.transactions.length : 0}</span>
      <span>
        <button onclick="viewUserDetails('${user.email}', 'individual')">View</button>
        <button onclick="suspendUser('${user.email}', 'individual')" class="danger-btn">Suspend</button>
      </span>
    `;
    userTable.appendChild(userRow);
  });
  
  // Add business users
  Object.values(businesses).forEach(business => {
    const userRow = document.createElement('div');
    userRow.className = 'user-row';
    userRow.innerHTML = `
      <span>${business.email}</span>
      <span>Business</span>
      <span>₹${business.balance}</span>
      <span>${business.transactions ? business.transactions.length : 0}</span>
      <span>
        <button onclick="viewUserDetails('${business.email}', 'business')">View</button>
        <button onclick="suspendUser('${business.email}', 'business')" class="danger-btn">Suspend</button>
      </span>
    `;
    userTable.appendChild(userRow);
  });
}

function loadAllTransactions() {
  const users = JSON.parse(localStorage.getItem('quorsa_users')) || {};
  const businesses = JSON.parse(localStorage.getItem('quorsa_businesses')) || {};
  const transactionTable = document.getElementById('adminTransactionTable');
  
  let allTransactions = [];
  
  // Collect all transactions
  Object.values(users).forEach(user => {
    if (user.transactions) {
      user.transactions.forEach(tx => {
        allTransactions.push({
          ...tx,
          userEmail: user.email,
          userType: 'Individual'
        });
      });
    }
  });
  
  Object.values(businesses).forEach(business => {
    if (business.transactions) {
      business.transactions.forEach(tx => {
        allTransactions.push({
          ...tx,
          userEmail: business.email,
          userType: 'Business'
        });
      });
    }
  });
  
  // Sort by timestamp (newest first)
  allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  transactionTable.innerHTML = `
    <div class="transaction-header">
      <span>User</span>
      <span>Type</span>
      <span>Amount</span>
      <span>To/From</span>
      <span>Timestamp</span>
      <span>Status</span>
    </div>
  `;
  
  allTransactions.slice(0, 100).forEach(tx => {
    const txRow = document.createElement('div');
    txRow.className = 'transaction-row';
    txRow.innerHTML = `
      <span>${tx.userEmail}</span>
      <span>${tx.type}</span>
      <span>₹${tx.amount}</span>
      <span>${tx.to || tx.from || 'N/A'}</span>
      <span>${tx.timestamp}</span>
      <span class="status-success">Success</span>
    `;
    transactionTable.appendChild(txRow);
  });
}

function loadAnalytics() {
  // Placeholder for advanced analytics
  console.log('Analytics loaded');
}

function loadSettings() {
  // Load current settings from localStorage or use defaults
  const settings = JSON.parse(localStorage.getItem('quorsa_settings')) || {
    maxIndividualTransfer: 100000,
    maxBusinessTransfer: 1000000,
    individualFee: 0.5,
    businessFee: 1.0,
    maintenanceMode: false,
    newRegistrations: true
  };
  
  document.getElementById('maxIndividualTransfer').value = settings.maxIndividualTransfer;
  document.getElementById('maxBusinessTransfer').value = settings.maxBusinessTransfer;
  document.getElementById('individualFee').value = settings.individualFee;
  document.getElementById('businessFee').value = settings.businessFee;
  document.getElementById('maintenanceMode').checked = settings.maintenanceMode;
  document.getElementById('newRegistrations').checked = settings.newRegistrations;
}

window.saveSettings = () => {
  const settings = {
    maxIndividualTransfer: document.getElementById('maxIndividualTransfer').value,
    maxBusinessTransfer: document.getElementById('maxBusinessTransfer').value,
    individualFee: document.getElementById('individualFee').value,
    businessFee: document.getElementById('businessFee').value,
    maintenanceMode: document.getElementById('maintenanceMode').checked,
    newRegistrations: document.getElementById('newRegistrations').checked
  };
  
  localStorage.setItem('quorsa_settings', JSON.stringify(settings));
  alert('Settings saved successfully!');
}

window.viewUserDetails = (email, userType) => {
  alert(`Viewing details for ${userType} user: ${email}`);
}

window.suspendUser = (email, userType) => {
  if (confirm(`Are you sure you want to suspend ${userType} user: ${email}?`)) {
    alert(`User ${email} has been suspended.`);
  }
}

window.filterTransactions = () => {
  const dateFrom = document.getElementById('transactionDateFrom').value;
  const dateTo = document.getElementById('transactionDateTo').value;
  
  if (dateFrom && dateTo) {
    alert(`Filtering transactions from ${dateFrom} to ${dateTo}`);
    loadAllTransactions(); // Reload with filters
  }
}

window.logout = () => {
  localStorage.removeItem('quorsa_current_user');
  localStorage.removeItem('quorsa_current_user_type');
  window.location.href = 'index.html';
                                                      }
