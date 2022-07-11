module.exports = function(name, organization, position, education, city, form, email, password) {
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
    <p>Должность: ${position}</p>
    <p>Ученая степень: ${education}</p>
    <p>Город: ${city}</p>
    <p>Форма участия: ${form}</p>
    <p>Email: ${email}</p>
    <p>Пароль: ${password}</p>
  </body>
</html>
  `;
}