const mongoose = require('mongoose');

const Service = mongoose.model('Service');
const Accommodation = mongoose.model('Accommodation');

module.exports.shortTermList = (req, res) => {
	Accommodation.find({}, (err, docs) => { // TODO
		if (err) {
			console.log('[ERROR] LocationsController: '+err);
		}

		// console.log("\Request Id: " + req.session.requestId);

		res.render('bedVacanciesList', {
			title: 'For Now',
			tagline: 'A place to stay',
			dlocations: docs,
			locations: [
				{
          _id: 12345,
					name: 'Youngle Group',
					availability: true,
					number: 94572188
				},{
          _id: 23456,
					name: 'Foyer House',
					availability: true,
					number: 94572188
				},{
          _id: 34567,
					name: 'Mission Australia',
					availability: false,
					number: 94572188
				}
			]
		});
	});
}

module.exports.longTermList = function(req, res) {
	let services;
	Service.find({}, function (err, docs) {
		if (err) {
			console.log('[ERROR] LocationsController: '+err);
		}
		services = docs;
	});

	res.render('bedVacanciesList', {
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
	let name = req.query.name;
	res.render('showLocation', {
		title: name,
		tagline: 'Bringing people together',
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
