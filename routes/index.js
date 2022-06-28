const { Router } = require('express');

const router = new Router();

router.get('/', require('./home'));

module.exports = router;
