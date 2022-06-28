const { Router } = require('express');

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

module.exports = router;
