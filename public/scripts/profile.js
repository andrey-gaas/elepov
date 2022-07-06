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
const reportForm = document.querySelector('#report-form');
const titleReportField = document.querySelector('#title');
const annotationReportField = document.querySelector('#annotation');
const fileReport = document.querySelector('#file');
const saveReportButton = document.querySelector('#save');

saveReportButton.onclick = function(event) {
  let hasError = false;

  console.log(fileReport.value);

  if (!titleReportField.value) {
    alert('Введите название доклада');
    hasError = true;
  }

  if (hasError) return false;

  const formData = new FormData(reportForm);
  
  fetch('/report', {
    method: 'post',
    body: formData,
  })
    .then(response => {
      document.location.reload();
    })
    .catch(error => console.log(error));
}

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