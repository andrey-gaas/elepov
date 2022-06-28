const form = document.querySelector('form');

form.onsubmit = async function(event) {

  const email = document.querySelector('input[name=email]');
  const password = document.querySelector('input[name=password]');
  let hasError = false;

  if (!email.value.length) {
    const error = email.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Введите Email';
    hasError = true;
  }

  if (!password.value.length) {
    const error = password.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Введите пароль';
    hasError = true;
  } else if (password.value.length < 6 || password.value.length > 20) {
    const error = password.nextSibling;
    error.classList.add('show');
    error.innerHTML = 'Введите валидный пароль';
    hasError = true;
  }
  
  if (hasError) event.preventDefault();
};