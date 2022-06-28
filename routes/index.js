const { Router } = require('express');
const validator = require("email-validator");
const Mongo = require('../db');

const router = new Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/biography', (req, res) => {
  res.render('biography');
});

router.get('/registration', (req, res) => {
  res.render('registration');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

// Handle data
router.post('/registration', async (req, res) => {
  const { name, organization, email, password, checkbox } = req.body;

  if (!name?.length) return res.render('registration', { error: 'Введите ФИО' });
  if (!organization?.length) return res.render('registration', { error: 'Введите название организации' });
  if (!validator.validate(email)) return res.render('registration', { error: 'Введите корректный Email' });
  if (!password?.length || password.length < 6 || password.length > 20) return res.render('registration', { error: 'Пароль должен содержать от 6 до 20 символов' });
  if (checkbox !== 'on') return res.render('registration', { error: 'Для регистрации необходимо согласие на обработку персональных данных' });

  try {
    const result = await Mongo.users.insertOne({ _id: email, name, organization, email, password });

    res.render('profile');
  } catch(error) {
    return res.render('registration', { error: 'Ошибка сервера. Попробуйте еще раз.' });
  }
});

module.exports = router;
