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