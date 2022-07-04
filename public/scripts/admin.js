// Удаление докладов

const removeButtons = document.querySelectorAll('.remove-button');

for (let i = 0; i < removeButtons.length; i++) {
  removeButtons[i].onclick = function({ target }) {
    fetch(`/report/${target.dataset.id}`, {
      method: 'delete',
    })
      .then(response => document.location.reload())
      .catch(error => console.log(error));
  } 
}