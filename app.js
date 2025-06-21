
// Quorsa Decentralized Fintech Protocol
let currentUser = null;
let currentUserType = null;

// Initialize demo data
if (!localStorage.getItem('quorsa_users')) {
  localStorage.setItem('quorsa_users', JSON.stringify({}));
}

if (!localStorage.getItem('quorsa_businesses')) {
  localStorage.setItem('quorsa_businesses', JSON.stringify({}));
}

if (!localStorage.getItem('quorsa_admin')) {
  localStorage.setItem('quorsa_admin', JSON.stringify({
    'admin@quorsa.com': {
      email: 'admin@quorsa.com',
      password: 'admin123',
      role: 'admin'
    }
  }));
}

// User type selection
window.selectUserType = (type) => {
  document.getElementById('userTypeSelection').style.display = 'none';
  document.getElementById(type + 'Auth').style.display = 'block';
}

window.goBack = () => {
  document.getElementById('userTypeSelection').style.display = 'block';
  document.getElementById('individualAuth').style.display = 'none';
  document.getElementById('businessAuth').style.display = 'none';
  document.getElementById('adminAuth').style.display = 'none';
}

// Generic signup function
window.signup = (userType) => {
  const email = document.getElementById(userType + 'Email').value;
  const password = document.getElementById(userType + 'Password').value;
  
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }
  
  let storageKey, userData;
  
  if (userType === 'individual') {
    storageKey = 'quorsa_users';
    userData = {
      email,
      password,
      userType: 'individual',
      balance: 1000,
      transactions: [],
      upiId: email.replace('@', '.') + '@quorsa'
    };
  } else if (userType === 'business') {
    const businessName = document.getElementById('businessName').value;
    if (!businessName) {
      alert('Please enter business name');
      return;
    }
    storageKey = 'quorsa_businesses';
    userData = {
      email,
      password,
      userType: 'business',
      businessName,
      balance: 10000,
      transactions: [],
      apiKeys: {
        test: 'test_sk_' + Math.random().toString(36).substr(2, 9),
        live: 'live_sk_' + Math.random().toString(36).substr(2, 9)
      },
      paymentLinks: [],
      analytics: {
        todayRevenue: 0,
        totalTransactions: 0,
        successRate: 100,
        activeUsers: 0
      }
    };
  }
  
  const users = JSON.parse(localStorage.getItem(storageKey));
  
  if (users[email]) {
    alert('User already exists. Please login instead.');
    return;
  }
  
  users[email] = userData;
  localStorage.setItem(storageKey, JSON.stringify(users));
  alert('Signup Successful! You can now login.');
}

// Generic login function
window.login = (userType) => {
  const email = document.getElementById(userType + 'Email').value;
  const password = document.getElementById(userType + 'Password').value;
  
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }
  
  let storageKey, redirectPage;
  
  if (userType === 'individual') {
    storageKey = 'quorsa_users';
    redirectPage = 'individual.html';
  } else if (userType === 'business') {
    storageKey = 'quorsa_businesses';
    redirectPage = 'business.html';
  } else if (userType === 'admin') {
    storageKey = 'quorsa_admin';
    redirectPage = 'admin.html';
  }
  
  const users = JSON.parse(localStorage.getItem(storageKey));
  
  if (users[email] && users[email].password === password) {
    currentUser = users[email];
    currentUserType = userType;
    localStorage.setItem('quorsa_current_user', JSON.stringify(currentUser));
    localStorage.setItem('quorsa_current_user_type', userType);
    window.location.href = redirectPage;
  } else {
    alert('Invalid email or password');
  }
}

// Signup function
window.signup = (userType) => {
  const email = document.getElementById(userType + 'Email').value;
  const password = document.getElementById(userType + 'Password').value;
  
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }
  
  let storageKey, redirectPage;
  
  if (userType === 'individual') {
    storageKey = 'quorsa_users';
    redirectPage = 'individual.html';
  } else if (userType === 'business') {
    storageKey = 'quorsa_businesses';
    redirectPage = 'business.html';
  }
  
  const users = JSON.parse(localStorage.getItem(storageKey)) || {};
  
  if (users[email]) {
    alert('User already exists. Please login instead.');
    return;
  }
  
  // Create new user
  const newUser = {
    email: email,
    password: password,
    userType: userType,
    balance: userType === 'individual' ? 1000 : 5000, // Demo balance
    upiId: email.replace('@', '@quorsa'),
    transactions: []
  };
  
  if (userType === 'business') {
    const businessName = document.getElementById('businessName').value;
    if (!businessName) {
      alert('Please enter business name');
      return;
    }
    newUser.businessName = businessName;
  }
  
  users[email] = newUser;
  localStorage.setItem(storageKey, JSON.stringify(users));
  
  // Auto-login after signup
  currentUser = newUser;
  currentUserType = userType;
  localStorage.setItem('quorsa_current_user', JSON.stringify(currentUser));
  localStorage.setItem('quorsa_current_user_type', userType);
  
  alert('Account created successfully!');
  window.location.href = redirectPage;
}

// Logout function
window.logout = () => {
  currentUser = null;
  currentUserType = null;
  localStorage.removeItem('quorsa_current_user');
  localStorage.removeItem('quorsa_current_user_type');
  window.location.href = 'index.html';
}

// Load current user on page load
window.addEventListener('load', () => {
  const savedUser = localStorage.getItem('quorsa_current_user');
  const savedUserType = localStorage.getItem('quorsa_current_user_type');
  
  if (savedUser && savedUserType) {
    currentUser = JSON.parse(savedUser);
    currentUserType = savedUserType;
  }
});
