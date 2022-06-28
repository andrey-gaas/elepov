// Редактирование ФИО
const nameField = document.querySelector('#name-field');
const nameInput = nameField.childNodes[1];
const nameEditButton = nameField.childNodes[2];


nameEditButton.onclick = function() {
  nameInput.disabled = false;

  nameEditButton.onclick = function() {
    const value = nameInput.value;
    if (!value.length) {
      alert('Введите корректное ФИО');
    } else {
      nameEditButton.onclick = null;
      fetch('/profile', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: value }),
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            nameInput.disabled = true;
          }
        })
        .catch(error => {
          console.log(error);
          alert(error)
        });
    }
  }
}