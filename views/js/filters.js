const deleteFilter = document.querySelectorAll('.delete-button');

deleteFilter.forEach(button => button.addEventListener('click', (event) => {
  fetch(`/api/v1/filter/${event.target.id}`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(() => window.location = '/filters');
}));
