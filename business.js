
// Business dashboard functionality
let businessCurrentUser = JSON.parse(localStorage.getItem('quorsa_current_user'));

// Initialize business dashboard
window.addEventListener('load', () => {
  if (!businessCurrentUser || businessCurrentUser.userType !== 'business') {
    window.location.href = 'index.html';
    return;
  }
  
  updateBusinessDashboard();
  loadBusinessTransactions();
});

function updateBusinessDashboard() {
  document.getElementById('businessName').textContent = businessCurrentUser.businessName;
  document.getElementById('todayRevenue').textContent = businessCurrentUser.analytics.todayRevenue;
  document.getElementById('totalTransactions').textContent = businessCurrentUser.analytics.totalTransactions;
  document.getElementById('successRate').textContent = businessCurrentUser.analytics.successRate;
  document.getElementById('activeUsers').textContent = businessCurrentUser.analytics.activeUsers;
}

function updateUserData() {
  const businesses = JSON.parse(localStorage.getItem('quorsa_businesses'));
  businesses[businessCurrentUser.email] = businessCurrentUser;
  localStorage.setItem('quorsa_businesses', JSON.stringify(businesses));
  localStorage.setItem('quorsa_current_user', JSON.stringify(businessCurrentUser));
}

function loadBusinessTransactions() {
  const transactionTable = document.getElementById('businessTransactions');
  
  if (businessCurrentUser.transactions && businessCurrentUser.transactions.length > 0) {
    transactionTable.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; background: #f7fafc; font-weight: bold;">
        <span>Type</span>
        <span>Amount</span>
        <span>Customer</span>
        <span>Time</span>
      </div>
    `;
    
    businessCurrentUser.transactions.slice(-10).reverse().forEach(tx => {
      const txRow = document.createElement('div');
      txRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e2e8f0;';
      txRow.innerHTML = `
        <span>${tx.type}</span>
        <span>₹${tx.amount}</span>
        <span>${tx.from || tx.to || 'N/A'}</span>
        <span>${tx.timestamp}</span>
      `;
      transactionTable.appendChild(txRow);
    });
  } else {
    transactionTable.innerHTML = '<p style="text-align: center; padding: 2rem; color: #718096;">No transactions yet</p>';
  }
}

// Modal functions
window.showCreatePaymentLink = () => {
  document.getElementById('paymentLinkModal').style.display = 'flex';
}

window.showQRGenerator = () => {
  document.getElementById('qrGeneratorModal').style.display = 'flex';
}

window.showAPIKeys = () => {
  document.getElementById('testApiKey').value = businessCurrentUser.apiKeys.test;
  document.getElementById('liveApiKey').value = businessCurrentUser.apiKeys.live;
  document.getElementById('apiKeysModal').style.display = 'flex';
}

window.createPaymentLink = () => {
  const amount = document.getElementById('linkAmount').value;
  const description = document.getElementById('linkDescription').value;
  const customerEmail = document.getElementById('linkCustomerEmail').value;
  
  if (!amount || !description) {
    alert('Please enter amount and description');
    return;
  }
  
  const linkId = 'link_' + Math.random().toString(36).substr(2, 9);
  const paymentLink = `https://quorsa.com/pay/${linkId}?amount=${amount}&desc=${encodeURIComponent(description)}`;
  
  document.getElementById('paymentLinkResult').value = paymentLink;
  document.getElementById('generatedLink').style.display = 'block';
}

window.copyLink = () => {
  const linkInput = document.getElementById('paymentLinkResult');
  linkInput.select();
  navigator.clipboard.writeText(linkInput.value).then(() => {
    alert('Payment link copied to clipboard!');
  });
}

window.generateBusinessQR = () => {
  const amount = document.getElementById('qrAmount').value;
  const description = document.getElementById('qrDescription').value;
  
  const qrDisplay = document.getElementById('businessQRCode');
  qrDisplay.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
    <p><strong>Business: ${businessCurrentUser.businessName}</strong></p>
    ${amount ? `<p>Amount: ₹${amount}</p>` : ''}
    ${description ? `<p>For: ${description}</p>` : ''}
    <p>Scan to pay</p>
  `;
}

window.copyApiKey = (type) => {
  const apiKey = type === 'test' ? businessCurrentUser.apiKeys.test : businessCurrentUser.apiKeys.live;
  navigator.clipboard.writeText(apiKey).then(() => {
    alert(`${type.toUpperCase()} API key copied to clipboard!`);
  });
}

window.closeModal = (modalId) => {
  document.getElementById(modalId).style.display = 'none';
  // Clear form fields
  const modal = document.getElementById(modalId);
  const inputs = modal.querySelectorAll('input');
  inputs.forEach(input => {
    if (!input.readOnly) {
      input.value = '';
    }
  });
  
  // Hide generated content
  const generatedLink = document.getElementById('generatedLink');
  if (generatedLink) {
    generatedLink.style.display = 'none';
  }
}

window.logout = () => {
  localStorage.removeItem('quorsa_current_user');
  localStorage.removeItem('quorsa_current_user_type');
  window.location.href = 'index.html';
}

function loadBusinessTransactions() {
  const transactionTable = document.getElementById('businessTransactions');
  
  if (currentUser.transactions && currentUser.transactions.length > 0) {
    transactionTable.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; background: #f7fafc; font-weight: bold;">
        <span>Type</span>
        <span>Amount</span>
        <span>Customer</span>
        <span>Time</span>
      </div>
    `;
    
    currentUser.transactions.slice(-10).reverse().forEach(tx => {
      const txRow = document.createElement('div');
      txRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e2e8f0;';
      txRow.innerHTML = `
        <span>${tx.type}</span>
        <span>₹${tx.amount}</span>
        <span>${tx.from || tx.to || 'N/A'}</span>
        <span>${tx.timestamp}</span>
      `;
      transactionTable.appendChild(txRow);
    });
  } else {
    transactionTable.innerHTML = '<p style="text-align: center; padding: 2rem; color: #718096;">No transactions yet</p>';
  }
}

// Modal functions
window.showCreatePaymentLink = () => {
  document.getElementById('paymentLinkModal').style.display = 'flex';
}

window.showQRGenerator = () => {
  document.getElementById('qrGeneratorModal').style.display = 'flex';
}

window.showAPIKeys = () => {
  document.getElementById('testApiKey').value = currentUser.apiKeys.test;
  document.getElementById('liveApiKey').value = currentUser.apiKeys.live;
  document.getElementById('apiKeysModal').style.display = 'flex';
}

window.createPaymentLink = () => {
  const amount = document.getElementById('linkAmount').value;
  const description = document.getElementById('linkDescription').value;
  const customerEmail = document.getElementById('linkCustomerEmail').value;
  
  if (!amount || !description) {
    alert('Please enter amount and description');
    return;
  }
  
  const linkId = 'link_' + Math.random().toString(36).substr(2, 9);
  const paymentLink = `https://quorsa.com/pay/${linkId}?amount=${amount}&desc=${encodeURIComponent(description)}`;
  
  document.getElementById('paymentLinkResult').value = paymentLink;
  document.getElementById('generatedLink').style.display = 'block';
}

window.copyLink = () => {
  const linkInput = document.getElementById('paymentLinkResult');
  linkInput.select();
  navigator.clipboard.writeText(linkInput.value).then(() => {
    alert('Payment link copied to clipboard!');
  });
}

window.generateBusinessQR = () => {
  const amount = document.getElementById('qrAmount').value;
  const description = document.getElementById('qrDescription').value;
  
  const qrDisplay = document.getElementById('businessQRCode');
  qrDisplay.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
    <p><strong>Business: ${currentUser.businessName}</strong></p>
    ${amount ? `<p>Amount: ₹${amount}</p>` : ''}
    ${description ? `<p>For: ${description}</p>` : ''}
    <p>Scan to pay</p>
  `;
}

window.copyApiKey = (type) => {
  const apiKey = type === 'test' ? currentUser.apiKeys.test : currentUser.apiKeys.live;
  navigator.clipboard.writeText(apiKey).then(() => {
    alert(`${type.toUpperCase()} API key copied to clipboard!`);
  });
}

window.closeModal = (modalId) => {
  document.getElementById(modalId).style.display = 'none';
  // Clear form fields
  const modal = document.getElementById(modalId);
  const inputs = modal.querySelectorAll('input');
  inputs.forEach(input => {
    if (!input.readOnly) {
      input.value = '';
    }
  });
  
  // Hide generated content
  const generatedLink = document.getElementById('generatedLink');
  if (generatedLink) {
    generatedLink.style.display = 'none';
  }
}

window.logout = () => {
  localStorage.removeItem('quorsa_current_user');
  localStorage.removeItem('quorsa_current_user_type');
  window.location.href = 'index.html';
    }
