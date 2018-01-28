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

    shortBtn.addEventListener('click', () => { fillLatLong(autocomplete) });
    longBtn.addEventListener('click', () => { fillLatLong(autocomplete) });
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
    document.getElementById('location').value = 'Finding your location ...';

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
                let locality, state, country;
                const addressComponents = results[0].address_components;
                console.log(addressComponents);

                for (i = 0; i < addressComponents.length; ++i)
                {                    
                    if (!country && addressComponents[i].types[0] == 'country')
                        country = addressComponents[i].long_name;
                    else if (!state && addressComponents[i].types[0] == 'administrative_area_level_1')
                        state = addressComponents[i].long_name;
                    else if (!locality && addressComponents[i].types[0] == 'locality')
                        locality = addressComponents[i].long_name;                    
                }
                document.getElementById('location').value = locality + ', ' + state + ', ' + country;
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

/**
 * Input location functionality.
 * Gets the address typed in by the user and 
 * sends the latitude and longitude into a form.
 */
$(document).ready(() => {
    $('#location').change(() => {
        const lat = document.getElementById('lat').value;
        const lng = document.getElementById('long').value;
        let templat, templong;        
    
        const address = document.getElementById('location').value;
        const geocoder = new google.maps.Geocoder;
        geocoder.geocode( { 'address': address }, (results, status) => {
            if (status == 'OK') 
            {
                templat = results[0].geometry.location.lat();
                templong = results[0].geometry.location.lng();

                if( lat != templat || lng != templong )
                {
                    document.getElementById('lat').value = templat;
                    document.getElementById('long').value = templong;        
                }
            } 
            else 
            {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });            
    })    
})