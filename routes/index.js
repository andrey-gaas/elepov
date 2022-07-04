const { Router } = require('express');
const passport = require('passport');
const validator = require("email-validator");
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const Mongo = require('../db');
const auth = require('../middlewares/auth');

const router = new Router();

router.get('/', (req, res) => {
  res.render('home', { user: req.user, title: 'К 80-летию Б.С. Елепова', page: 'home' });
});

router.get('/biography', (req, res) => {
  res.render('biography', { user: req.user, title: 'Биография Б.С. Елепова', page: 'biography' });
});

router.get('/registration', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/profile');
  res.render('registration', { title: 'Регистрация' });
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/profile');
  res.render('login', { title: 'Вход' });
});

router.get('/profile', auth, async (req, res) => {
  const reports = await Mongo
    .reports
    .find({ user: req.user._id })
    .toArray();

    console.log(reports);

  res.render('profile', { title: 'Личный кабинет', user: req.user, reports });
});

router.get('/logout', (req, res, next) => {
  req.logOut(function(asd) {
    res.redirect('/');
  });
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
    const user = await Mongo.users.findOne({ _id: email });
    if (user !== null) {
      return res.render('registration', { error: 'Пользователь с таким Email уже зарегистрирован' });
    }
  } catch(error) {
    return res.render('registration', { error: 'Ошибка сервера. Попробуйте еще раз.' });
  }

  try {
    const result = await Mongo.users.insertOne({ _id: email, name, organization, email, password });
    
    req.logIn({ email, password }, function(err) {
      return err
        ? res.redirect('/login')
        : res.redirect('/profile');
    });
  } catch(error) {
    return res.render('registration', { error: 'Ошибка сервера. Попробуйте еще раз.' });
  }
});

router.post('/login', passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login'}));

router.put('/profile', auth, async (req, res) => {
  try {
    await Mongo.users.findOneAndUpdate({ _id: req.user.email }, { '$set': req.body });

    res.send({ success: true });
  } catch(error) {
    console.log(error);
    return res.status(500).send({ error: 'Ошибка сервера. Попробуйте еще раз.' });
  }
});

router.post('/report', auth, async (req, res) => {
  const report = req.files.file;
  const { title, annotation } = req.body;
  
  if (!title) {
    return res.status(400).send('Введите название доклада');
  }
  
  if (!annotation) {
    return res.status(400).send('Введите аннотацию');
  }
  
  if (!report) {
    return res.status(400).send('Прикрепита файл доклада');
  }

  const fileExtension = report.name.split('.').pop();
    
  // Название файла: id + оригинальное расширение
  const fileName = `${uuid.v4()}.${fileExtension}`;

  // Сохранение файла
  try {
    report.mv(path.join(__dirname, '..', 'public', 'reports', fileName));
  } catch(error) {
    return res.status(400).send('Ошибка сохранения файла. Попробуйте еще раз');
  }

  const data = {};

  data.user = req.user._id;
  data.title = title;
  data.annotation = annotation;
  data.file = `/reports/${fileName}`;

  try {
    await Mongo.reports.insertOne(data);

    res.send({ success: true });
  } catch(error) {
    return res.status(500).send('Ошибка сервера. Попробуйте еще раз');
  }
});

module.exports = router;
