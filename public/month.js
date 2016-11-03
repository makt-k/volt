const updateButton = document.getElementById('update');
const deleteButton = document.getElementById('delete');
const month = document.getElementById('monthLabel').dataset.month;


deleteButton.addEventListener('click', () => {
  fetch(`/month/${month}`, {
    method: 'delete'
  })
  .then(res => {
    if (res.ok) window.location = '/';
  })
})
