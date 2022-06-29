function editData(field, inncorrectMessage) {
  return function() {
    const input = field.childNodes[1];
    const editButton = field.childNodes[2];

    
    input.disabled = false;
    editButton.classList.add('save');

    editButton.onclick = function(event) {
      const value = input.value;
      if (!value.length) {
        alert(inncorrectMessage);
      } else {
        editButton.onclick = null;
        fetch('/profile', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ [input.name]: value }),
        })
          .then(response => response.json())
          .then(response => {
            editButton.classList.remove('save');
            if (response.success) {
              input.disabled = true;
              editButton.onclick = editData(field, inncorrectMessage);
            }
          })
          .catch(error => {
            console.log(error);
            alert(error)
          });
      }
    }
  };
}

// Редактирование ФИО
const nameField = document.querySelector('#name-field');
const nameEditButton = nameField.childNodes[2];
nameEditButton.onclick = editData(nameField, 'Введите корректное ФИО');

// Редактирование организации
const organizationField = document.querySelector('#organization-field');
const organizationEditButton = organizationField.childNodes[2];
organizationEditButton.onclick = editData(organizationField, 'Введите корректное название организации');

// Доклад