
function toggleLoginPopup() {
  const popup = document.getElementById('login-popup');
  popup.classList.toggle('hidden');
}

// Close popup when clicking outside of it
document.addEventListener('click', function(event) {
  const popup = document.getElementById('login-popup');
  const loginButton = document.querySelector('nav button');
  
  if (!popup.contains(event.target) && !loginButton.contains(event.target)) {
    popup.classList.add('hidden');
  }
});

// Prevent popup from closing when clicking inside it
document.getElementById('login-popup').addEventListener('click', function(event) {
  event.stopPropagation();
});
