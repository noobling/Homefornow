module.exports.bedVacanciesList = function(req, res) {
	res.render('bedVacanciesList', {
		title: 'Bed vaccancies',
		tagline: 'A place to stay', 
		locations: [
			{
				name: 'Mission Australia',
				availability: 'Available',
				number: 94572188
			},{
				name: 'Mission Australia',
				availability: 'Available',
				number: 94572188
			},{
				name: 'Mission Australia',
				availability: 'Available',
				number: 94572188
			}

		]
	});
}

module.exports.showLocation = function(req, res) {
	res.render('showLocation', {
		title: 'Mission Australia', 
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
			title: 'Mission Australia Service',
			url: 'https://maps.googleapis.com/maps/api/staticmap?center=40.711614,-74.012318&size=800x800&&markers=color:green%7Clabel:G%7C40.711614,-74.012318&zoom=13'
		},
		additionalInfo: 'Every day we support people nationwide by combatting homelessness, assisting disadvantaged families and children, addressing mental health issues, fighting substance dependencies, and much more. We’re generously supported by our funders, partners and tens of thousands of everyday Australians, who make the work of our tireless volunteers and staff possible.'
	})
}