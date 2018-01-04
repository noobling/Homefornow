var express = require('express');
var router = express.Router();

// Services Dashboard route
router.get('/', function(req, res) {
	res.send('Service page dashboard');
});

// Services Profile Page route
router.get('/profile', function(req, res) {
	res.send('Service profile page');
});

module.exports = router;
