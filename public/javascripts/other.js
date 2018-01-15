function initialize() // Google places autocomplete
{
    var options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'au' }
    };

    var input = document.getElementById('location');
    var autocomplete = new google.maps.places.Autocomplete(input, options);
        var place = autocomplete.getPlace();
        // get lat
        var lat = place.geometry.location.lat();
        // get lng
        var lng = place.geometry.location.lng();
        console.log(lat);
        console.log(lng)
    
}

$(() => { // jquery for geolocation
    $('.geoloc').on('click', geoloc);
});

function geoloc() // 'Use Current Location' functionality
{
    if (!navigator.geolocation)
    {   
			alert('Geolocation is not supported by your browser');  
		}
    
    function success(position)
    {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        document.getElementById('location').value = lat + ', ' + lng;
    }

    function error()
    {   
			alert('Unable to retrieve your location');  
		}
    
    navigator.geolocation.getCurrentPosition(success, error);
}

function initMap() // Map that displays on the services page that user sees
{
    var coord = {lat: -31.986, lng: 115.822}; // need to change to service accomodation latlng
    var map = new google.maps.Map(document.getElementById('map'),
    {
        zoom: 14,
        center: coord,
        disableDefaultUI: true,
        zoomControl: true
    });
    var marker = new google.maps.Marker({
        position: coord,
        map: map
    });
}
