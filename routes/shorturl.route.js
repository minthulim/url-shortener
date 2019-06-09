const express = require('express');
const router = express.Router();

const shorturlController = require('../controllers/shorturl.controller');

router.post('/new', shorturlController.addUrl);
router.get('/:key', shorturlController.processShortUrl);

module.exports = router;