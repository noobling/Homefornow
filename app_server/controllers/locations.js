var mongoose = require('mongoose');
var Service = mongoose.model('Service');

module.exports.shortTermList = function(req, res) {
	Service.find({}, function (err, docs) {
		if (err) {
			console.log('[ERROR] LocationsController: '+err);
		}
		res.render('bedVacanciesList', {
			user: req.session.user,
			title: 'For Now',
			tagline: 'A place to stay',
			dlocations: docs,
			locations: [
				{
					name: 'Youngle Group',
					availability: true,
					number: 94572188
				},{
					name: 'Foyer House',
					availability: true,
					number: 94572188
				},{
					name: 'Mission Australia',
					availability: false,
					number: 94572188
				}
	
			]
		});
	});
}

module.exports.longTermList = function(req, res) {
	var services;
	Service.find({}, function (err, docs) {
		if (err) {
			console.log('[ERROR] LocationsController: '+err);
		}
		services = docs;
	});
	
	res.render('bedVacanciesList', {
		user: req.session.user,
		title: 'For Future',
		tagline: 'A place to stay',
		dlocations: services,
		locations: [
			{
				name: 'Youngle Group',
				availability: true,
				number: 94572188
			},{
				name: 'Foyer House',
				availability: true,
				number: 94572188
			},{
				name: 'Mission Australia',
				availability: false,
				number: 94572188
			}

		]
	});
}

module.exports.showLocation = function(req, res) {
	var name = req.query.name;
	res.render('showLocation', {
		user: req.session.user,
		title: name,
		tagline: 'Bringing people together',
		user: req.session.user,
		location: {
			info: 'Located in East Perth',
			opening: '9am',
			closing: '5pm',
			facilities: [
				'Hot Drinks',
				'Wifi',
				'Personal Rooms',
				'Councilors'
			],
			restrictions: [
				'10pm curfew',
				'No drugs',
				'No alcohol',
				'No medical issues'
			]
		},
		map: {
			title: name,
			suburb: 'Crawley'
		},
		additionalInfo: 'Every day we support people nationwide by combatting homelessness, assisting disadvantaged families and children, addressing mental health issues, fighting substance dependencies, and much more. We’re generously supported by our funders, partners and tens of thousands of everyday Australians, who make the work of our tireless volunteers and staff possible.'
	})
}
