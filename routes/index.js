const { Router } = require('express');

const router = new Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/biography', (req, res) => {
  res.render('biography');
});

module.exports = router;
