/**
 * Initialises the Google places autocomplete object.
 */
function initialize()
{
    const options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'au' }
    };

    const input = document.getElementById('location');
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    const shortBtn = document.getElementById('shortBtn');
    const longBtn = document.getElementById('longBtn');

    shortBtn.addEventListener("click", () => { fillLatLong(autocomplete) });
    longBtn.addEventListener("click", () => { fillLatLong(autocomplete) });
}

/**
 * Copies the latitude and longitude from the Google places autocomplete
 * object into a form.
 * @param  {Object} autocomplete Google places autocomplete object
 */
function fillLatLong(autocomplete) // Fills form with lat and long from the Google Maps API
{
  const place = autocomplete.getPlace();
  if(place) 
  {
    document.getElementById('lat').value = place.geometry.location.lat();
    document.getElementById('long').value = place.geometry.location.lng();
  }
}

/**
 * 'Use Current Location' functionality.
 * Gets the user's current latitude and longitude coordinates
 * and passes them into a form.
 */
function geoloc()
{
    document.getElementById('location').value = "Finding your location ...";

    if (!navigator.geolocation)
    {
		alert('Geolocation is not supported by your browser');
	}

    function success(position)
    {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        document.getElementById('lat').value = lat;
        document.getElementById('long').value = lng;

        const geocoder = new google.maps.Geocoder;
        geocoder.geocode( { 'address': lat + ', ' + lng }, (results, status) => {
            if (status == 'OK') 
            {
                document.getElementById('location').value = results[0].address_components[2].long_name + ', ' + results[0].address_components[4].long_name + ', Australia';
            } 
            else 
            {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function error()
    {
		alert('Unable to retrieve your location');
	}

    navigator.geolocation.getCurrentPosition(success, error);
}
