module.exports.index = function(req, res) {
    res.render('index', {
        user: req.session.user,
        title: 'Do you have a secure place to stay?',
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
