var express = require('express');
var router = express.Router();

var service_controller = require('../controllers/service');

// Services Dashboard route
router.get('/', service_controller.dashboard);

// Services Profile Page route
router.get('/profile', service_controller.profile);

module.exports = router;
