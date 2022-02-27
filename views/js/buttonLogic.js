const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', () => {
  fetch('/logout', {
    method: 'get',
    credentials: 'include'
  })
    .then(() => window.location = '/');
});
