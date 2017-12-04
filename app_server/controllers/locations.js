var request = require('request');
var apiOptions = {
	server: 'http://localhost:3000'
}
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = 'https://wifilocator3000.herokuapp.com'; 
}

/* GET home page */
module.exports.homelist = function(req, res) {
	var requestOptions, path;
	path = '/api/locations';
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {},
		qs: {
			lng: -0.799192,
			lat: 59.32121
		}
	}
	
	request(requestOptions, function(err, response, body) {
		if (response.statusCode === 200) {
			/**
			 * Everything went well with API call now try to
			 * display the contents back to the user
			 */

			if (err) {
				console.log('[ERROR] locationsController.homelist: ' + err);
			}
			var l = body.length;
			var i;
		
			/** 
			 * Round off the location distances 
			 * and add units
			 **/
			for (i = 0; i < l; i++) {
				body[i].distance = parseInt(body[i].distance) + 'km';
			}

			/** Display contents back to user */
			renderHomeList(res, err, response, body);
		} else {
			/**
		 	* API did not return 200 OK so there was an error
		 	*/
			if (err) {
				renderErrorPage(res, response.status, err)
			} else {
				renderErrorPage(res, response.statusCode, body);
			}
		}

	});
}

/* GET locations info */
module.exports.locationInfo = function(req, res) {
	var requestOptions, path;
	path = '/api/locations/' + req.params.locationid;
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {},
		qs: {}
	};

	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log('[ERROR] locationsController.locationInfo: ' + err);
		}

		renderLocationInfo(res, body);
	});
}

/* GET review page */
module.exports.addReview = function(req, res) {
    var requestOptions, path;
	path = '/api/locations/' + req.params.locationid;
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {},
		qs: {}
	};

	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log('[ERROR] locationsController.addReview: ' + err);
		}

		renderReviewPage(res, body);
	});
}

/** 
 * POST
 * Create a new review
 */
module.exports.createReview = function(req, res) {
	var requestOptions, path;
	path = '/api/locations/' + req.params.locationid + '/reviews';
	requestOptions = {
		url: apiOptions.server + path,
		method: 'POST',
		json: {
			authorName: req.body.name,
			rating: parseInt(req.body.rating, 10),
			reviewText: req.body.review
		},
		qs: {}
	};

	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log('[ERROR] locationsController.createReview: ' + err);
		}
		if (response.statusCode === 201) {
			res.redirect('/locations/' + req.params.locationid);
		} else {
			renderErrorPage(res, response.statusCode, body);
		}
		
	});
}


var renderHomeList = function(res, err, response, responseBody) {
	/**
	 * Can't get any locations
	 */
	if (responseBody.message) {
		res.render('location-list', {
			title: 'Home',
			pageHeader: {
				title: 'Loc8r',
				tagline: 'Find places to work with wifi near you!'
			},
			error: err,
			message: responseBody.message,
			locations: undefined
		});

	/**
	 * Render locations back to user
	 */
	} else {
		res.render('location-list', {
			title: 'Home',
			pageHeader: {
				title: 'Loc8r',
				tagline: 'Find places to work with wifi near you!'
			},
			error: err,
			locations: responseBody
		});
	}

}

var renderLocationInfo = function(res, body) {
	console.log(body);
	res.render('location-info', {
		title: body.name,
		pageHeader: {
			title: body.name
		},
		info: {
			address: body.address,
			rating: body.rating,
			facilities: body.facilities,
			distance: body.distance
		},
		openingTimes: {
			title: 'Opening Hours',
			times: {
				weekdays: '7:00am - 9:00pm',
				saturday: '8:00am - 5:00pm',
				sunday: 'closed'
			}
		},
		facilities: ['Hot drinks', 'Food', 'premium wifi'],
		map: {
			title: 'Location Map',
			url: 'https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794'
		},
		reviews: [{
			author: 'David Yu',
			timeStamp: '16 August 2018',
			userText: ''
		}, {
			author: 'Jayden Smith',
			timeStamp: '20 August 2020',
			userText: 'It was a brilliant coffee shop'
		}],
		aboutLocation: 'Great cafe space to sit down and do stuff',
		suggestion: 'If you have been there please leave a review',
		location: body	
	});
}

var renderErrorPage = function(res, statusCode, content) {
	var payload = {title: statusCode};
	if (statusCode === 404) { payload.content = 'Not found' }
	else { payload.content = 'Something went wrong :/' }
	res.render('error-page', payload);
}; 


/**
 * Displays {content} into the view 'location-review'
 * This view is used to display the location review form 
 * to the user
 * 
 * @param {*} res 
 * @param {JSON} content data to be passed onto the view
 */
var renderReviewPage = function(res, content) {
	res.render('location-review', {
		title: 'Add Review',
		pageHeader: {
			title: content.name
		}
	});
}