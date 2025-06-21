// Individual wallet functionality
let currentUser = JSON.parse(localStorage.getItem('quorsa_current_user'));

// Initialize individual dashboard
window.addEventListener('load', () => {
  if (!currentUser || currentUser.userType !== 'individual') {
    window.location.href = 'index.html';
    return;
  }

  updateBalance();
  loadTransactions();
  displayUPIId();
});

function updateBalance() {
  document.getElementById('balance').textContent = currentUser.balance || 0;
}

function displayUPIId() {
  const upiIdElement = document.getElementById('upiId');
  if (upiIdElement) {
    upiIdElement.textContent = currentUser.upiId || currentUser.email.replace('@', '@quorsa');
  }
}

function updateUserData() {
  const users = JSON.parse(localStorage.getItem('quorsa_users')) || {};
  users[currentUser.email] = currentUser;
  localStorage.setItem('quorsa_users', JSON.stringify(users));
  localStorage.setItem('quorsa_current_user', JSON.stringify(currentUser));
}

function loadTransactions() {
  const transactionList = document.getElementById('transactionList');

  if (!transactionList) return;

  transactionList.innerHTML = '';

  if (currentUser.transactions && currentUser.transactions.length > 0) {
    currentUser.transactions.slice(-10).reverse().forEach(tx => {
      const txElement = document.createElement('div');
      txElement.className = 'transaction-item';
      txElement.innerHTML = `
        <div class="tx-info">
          <div class="tx-type">${tx.type}</div>
          <div class="tx-details">${tx.to || tx.from || 'System'}</div>
          <div class="tx-time">${tx.timestamp}</div>
        </div>
        <div class="tx-amount ${tx.type === 'Send' || tx.type === 'Sent' ? 'debit' : 'credit'}">
          ${tx.type === 'Send' || tx.type === 'Sent' ? '-' : '+'}₹${tx.amount}
        </div>
      `;
      transactionList.appendChild(txElement);
    });
  } else {
    transactionList.innerHTML = '<p class="no-transactions">No transactions yet</p>';
  }
}

// Modal functions
window.showSendMoney = () => {
  document.getElementById('sendMoneyModal').style.display = 'flex';
}

window.showAddMoney = () => {
  const amount = prompt('Enter amount to add:');
  if (amount && !isNaN(amount) && amount > 0) {
    currentUser.balance = (currentUser.balance || 0) + parseFloat(amount);
    if (!currentUser.transactions) {
      currentUser.transactions = [];
    }
    currentUser.transactions.push({
      type: 'Credit',
      amount: parseFloat(amount),
      from: 'Bank Transfer',
      timestamp: new Date().toLocaleString()
    });
    updateUserData();
    updateBalance();
    loadTransactions();
    alert('Money added successfully!');
  }
}

window.showQRCode = () => {
  document.getElementById('qrModal').style.display = 'flex';
  generatePersonalQR();
}

window.showUPISection = () => {
  document.getElementById('upiModal').style.display = 'flex';
}

window.showRequestMoney = () => {
  alert('Request money feature will be implemented soon');
}

window.sendMoney = () => {
  const to = document.getElementById('sendTo').value;
  const amount = parseFloat(document.getElementById('sendAmount').value);
  const note = document.getElementById('sendNote').value;

  if (!to || !amount || amount <= 0) {
    alert('Please enter valid details');
    return;
  }

  if (amount > (currentUser.balance || 0)) {
    alert('Insufficient balance');
    return;
  }

  currentUser.balance = (currentUser.balance || 0) - amount;
  if (!currentUser.transactions) {
    currentUser.transactions = [];
  }
  currentUser.transactions.push({
    type: 'Send',
    amount: amount,
    to: to,
    note: note,
    timestamp: new Date().toLocaleString()
  });

  updateUserData();
  updateBalance();
  loadTransactions();
  closeModal('sendMoneyModal');
  alert('Money sent successfully!');
}

window.generatePersonalQR = () => {
  const qrDisplay = document.getElementById('personalQRCode');
  if (qrDisplay) {
    qrDisplay.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
      <p><strong>${currentUser.email}</strong></p>
      <p>UPI ID: ${currentUser.upiId || currentUser.email.replace('@', '@quorsa')}</p>
      <p>Scan to pay</p>
    `;
  }
}

window.copyUPIId = () => {
  const upiId = currentUser.upiId || currentUser.email.replace('@', '@quorsa');
  navigator.clipboard.writeText(upiId).then(() => {
    alert('UPI ID copied to clipboard!');
  });
}

window.closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    // Clear form fields
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
      if (!input.readOnly) {
        input.value = '';
      }
    });
  }
}

window.logout = () => {
  localStorage.removeItem('quorsa_current_user');
  localStorage.removeItem('quorsa_current_user_type');
  window.location.href = 'index.html';
  }
