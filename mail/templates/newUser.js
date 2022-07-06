module.exports = function(name, organization, email, password) {
  return `
  <html>
  <head>
  </head>
  <body>
    <p>
      Регистрация нового участника.
    </p>
    <p><b>Данные пользователя:</b><p/>
    <p>ФИО: ${name}</p>
    <p>Организация: ${organization}</p>
    <p>Email: ${email}</p>
    <p>Пароль: ${password}</p>
  </body>
</html>
  `;
}