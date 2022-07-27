const { Router } = require('express');
const passport = require('passport');
const validator = require("email-validator");
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const Mongo = require('../db');
const auth = require('../middlewares/auth');
const sendMail = require('../mail/sendMail');

const router = new Router();


router.use('*', (req, res, next) => {
  if (!req.cookies.lang) {
    req.lang = 'ru';
    res.cookie('lang', 'ru', { maxAge: 900000, httpOnly: true });
  } else {
    req.lang = req.cookies.lang;
  }
  next();
});

// PAGES

router.get('/', (req, res) => {
  res.render(
    `home_${req.lang}`,
    {
      user: req.user,
      title: req.lang === 'ru' ? 'К 80-летию Б.С. Елепова' : 'To the 80th anniversary of B.S. Elepov',
      page: 'home',
    },
  );
});

router.get('/biography', (req, res) => {
  res.render(
    `biography_${req.lang}`,
    {
      user: req.user,
      title: req.lang === 'ru' ? 'Биография Б.С. Елепова' : 'Biography of B.S. Elepov',
      page: 'biography'
    },
  );
});

router.get('/registration', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/profile');

  res.render(
    `registration_${req.lang}`,
    {
      title: req.lang === 'ru' ? 'Регистрация' : 'Sign Up',
      page: 'reginstration'
    },
  );
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/profile');

  res.render(
    `login_${req.lang}`,
    {
      title: req.lang === 'ru' ? 'Вход' : 'Sign In',
      page: 'login',
    },
  );
});

router.get('/profile', auth, async (req, res) => {
  const reports = await Mongo
    .reports
    .find({ 'user._id': req.user._id })
    .toArray();

  res.render(
    `profile_${req.lang}`,
    {
      title: req.lang === 'ru' ? 'Личный кабинет' : 'Personal Area',
      user: req.user,
      reports,
      page: 'profile',
    },
  );
});

router.get('/admin', auth, (req, res) => {
  if (!req.user.admin) {
    return res.redirect('/profile');
  }

  res.render('admin', { user: req.user });
});

router.get('/admin/reports', auth, async (req, res, next) => {
  if (!req.user.admin) {
    return res.redirect('/profile');
  }

  let reports = null;

  try {
    reports = await Mongo
      .reports
      .find({})
      .toArray();
  } catch(error) {
    return res.status(500).send('Ошибка сервера');
  }

  res.render('admin-reports', { reports, user: req.user });
});

router.get('/admin/users', auth, async (req, res, next) => {
  if (!req.user.admin) {
    return res.redirect('/profile');
  }

  let users = null;

  try {
    users = await Mongo
      .users
      .find({})
      .toArray();
  } catch(error) {
    return res.status(500).send('Ошибка сервера');
  }

  res.render('admin-users', { users, user: req.user });
});

router.get('/lang', (req, res) => {
  let { lang, page } = req.query;
  res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });

  if (page === 'home') {
    page = '';
  }

  res.redirect(`/${page}`);
});

// Handle data
router.post('/registration', async (req, res) => {
  const { name, organization, position, education, city, form, email, password, checkbox } = req.body;

  if (!name || !name.length) return res.render('registration', { error: 'Введите ФИО' });
  if (!organization || !organization.length) return res.render('registration', { error: 'Введите название организации' });
  if (!position || !position.length) return res.render('registration', { error: 'Укажите вашу должность' });
  if (!city || !city.length) return res.render('registration', { error: 'Укажите город' });
  if (!form || !form.length) return res.render('registration', { error: 'Выберите форму участия' });
  if (!validator.validate(email)) return res.render('registration', { error: 'Введите корректный Email' });
  if (!password || !password.length || password.length < 6 || password.length > 20) return res.render('registration', { error: 'Пароль должен содержать от 6 до 20 символов' });
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
    const result = await Mongo.users.insertOne({ _id: email, name, organization, position, education, city, form, email, password });
    
    req.logIn({ email, password }, function(err) {
      return err
        ? res.redirect('/login')
        : res.redirect('/profile');
    });
  } catch(error) {
    return res.render('registration', { error: 'Ошибка сервера. Попробуйте еще раз.' });
  }

  // Письмо пользователю
  try {
    await sendMail({
      email,
      subject: "Регистрация на elepov.gpntbsib.ru",
      text: "",
    }, require('../mail/templates/registrarion')(email, password));
  } catch(error) {
    console.log(error);
  }

  // Письмо проверяльщику
  try {
    await sendMail({
      email: 'stukalova@gpntbsib.ru',
      subject: "Регистрация нового участника",
      text: "",
    }, require('../mail/templates/newUser')(name, organization, position, education, city, form, email, password));
  } catch(error) {
    console.log(error);
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

router.get('/logout', (req, res, next) => {
  req.logOut(function(asd) {
    res.redirect('/');
  });
});

// Reports
router.post('/report', auth, async (req, res) => {
  let report = null;
  let fileName = null;
  const { title, annotation } = req.body;
  
  if (!title) {
    return res.status(400).send('Введите название доклада');
  }
  
  if (req.files && req.files.file) {
    report = req.files.file;

    const fileExtension = report.name.split('.').pop();

    // Название файла: id + оригинальное расширение
    fileName = `${uuid.v4()}.${fileExtension}`;
    
    // Сохранение файла
    try {
      report.mv(path.join(__dirname, '..', 'public', 'reports', fileName));
    } catch(error) {
      return res.status(400).send('Ошибка сохранения файла. Попробуйте еще раз');
    }
  }

  const data = {};

  data._id = uuid.v4();
  data.user = {
    ...req.user,
  };
  data.title = title;
  data.annotation = annotation;
  data.file = fileName ? `/reports/${fileName}` : null;

  try {
    await Mongo.reports.insertOne(data);

    res.send({ success: true });
  } catch(error) {
    return res.status(500).send('Ошибка сервера. Попробуйте еще раз');
  }
});

router.delete('/report/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const result = await Mongo
      .reports
      .findOneAndDelete({ _id });

    res.send(result);
  } catch(error) {
    return res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
