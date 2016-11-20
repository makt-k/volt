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

updateButton.addEventListener('click', () => {
  fetch(`/month/${month}`, {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'month': `${month}`,
      'challenge': document.getElementById('challenge').value,
      'reason': document.getElementById('reason').value,
      'notificationTime': document.getElementById('time').value
    })
  })
  .then(res => {
    if (res.ok) window.location.reload(true);
  })
})
