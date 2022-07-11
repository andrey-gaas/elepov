const form = document.querySelector('form');

form.onsubmit = async function(event) {
  const name = document.querySelector('input[name=name]');
  const organization = document.querySelector('input[name=organization]');
  const position = document.querySelector('input[name=position]');
  const city = document.querySelector('input[name=city]');
  const form = document.querySelector('input[name=form]');
  const email = document.querySelector('input[name=email]');
  const password = document.querySelector('input[name=password]');
  const checkbox = document.querySelector('input[name=checkbox]');
  let hasError = false;

  if (!name.value.length) {
    const error = name.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Введите ФИО';
    hasError = true;
  }

  if (!organization.value.length) {
    const error = organization.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Укажите название организации';
    hasError = true;
  }

  if (!position.value.length) {
    const error = position.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Укажите вашу должность';
    hasError = true;
  }

  if (!city.value.length) {
    const error = city.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Укажите город';
    hasError = true;
  }

  if (!form.value.length) {
    const error = form.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Выберите форму участия';
    hasError = true;
  }

  if (!email.value.length) {
    const error = email.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Введите Email';
    hasError = true;
  }

  if (!password.value.length) {
    const error = password.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Придумайте пароль';
    hasError = true;
  } else if (password.value.length < 6 || password.value.length > 20) {
    const error = password.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Пароль должен содержать от 6 до 20 символов';
    hasError = true;
  }

  if (!checkbox.checked) {
    const error = document.querySelector('button + span.error');
    console.log(error);
    error.classList.add('show');
    error.innerHTML = 'Для регистрации необходимо согласие на обработку персональных данных';
    hasError = true;
  }

  if (hasError) event.preventDefault();
}