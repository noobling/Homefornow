module.exports.index = function(req, res) {
    // /console.log(req.flash().error[0])
    res.render('index', {
        user: req.user,
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
