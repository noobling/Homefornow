module.exports.shortTermList = function(req, res) {
	res.render('bedVacanciesList', {
		title: 'For Now',
		tagline: 'A place to stay',
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

module.exports.longTermList = function(req, res) {
	res.render('bedVacanciesList', {
		title: 'For Future',
		tagline: 'A place to stay',
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
	res.render('showLocation', {
		title: 'Mission Australia',
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
			title: 'Mission Australia Service',
			suburb: 'Crawley'
		},
		additionalInfo: 'Every day we support people nationwide by combatting homelessness, assisting disadvantaged families and children, addressing mental health issues, fighting substance dependencies, and much more. We’re generously supported by our funders, partners and tens of thousands of everyday Australians, who make the work of our tireless volunteers and staff possible.'
	})
}
