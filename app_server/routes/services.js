const express = require('express');

const router = express.Router();

const serviceController = require('../controllers/service');

// Services Dashboard route
router.get('/', serviceController.dashboard);

// Services Profile Page route
router.get('/profile', serviceController.profile);

module.exports = router;
