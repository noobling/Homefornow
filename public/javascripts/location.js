/**
 * Initialises the Google places autocomplete object.
 * Adds event listeners to the 'For now' and 'Long term' buttons on the index page.
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

    shortBtn.addEventListener('click', () => { search(autocomplete, false) });
    longBtn.addEventListener('click', () => { search(autocomplete, true) });
}

/**
 * 'Use Current Location' functionality.
 * Gets the user's current latitude and longitude coordinates.
 */
function geoloc()
{
    const oldLocValue = document.getElementById('location').value;
    document.getElementById('location').value = 'Finding your location ...';

    if (!navigator.geolocation)
    {
      alert('Geolocation is not supported by your browser');
      document.getElementById('location').value = oldLocValue;
    }

    function success(position)
    {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const geocoder = new google.maps.Geocoder;
        geocoder.geocode( { 'address': lat + ', ' + lng }, (results, status) => {
            if (status == 'OK')
            {
                let locality, state, country;
                const addressComponents = results[0].address_components;

                for (i = 0; i < addressComponents.length; ++i)
                {
                    if (!country && addressComponents[i].types[0] == 'country')
                        country = addressComponents[i].long_name;
                    else if (!state && addressComponents[i].types[0] == 'administrative_area_level_1')
                        state = addressComponents[i].short_name;
                    else if (!locality && addressComponents[i].types[0] == 'locality')
                        locality = addressComponents[i].long_name;
                }
                document.getElementById('location').value = locality + ' ' + state + ', ' + country;
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
      document.getElementById('location').value = oldLocValue;
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

// /**
//  * Create and submit a form with the searched lat, long and length of stay.
//  * @param  {Object} coords       JSON object containing lat and long coordinates of searched location.
//  * @param  {String} lengthOfStay If the user is searching for 'short_term' or 'long_term' accommodation.
//  */
// function signedInSearch(coords, lengthOfStay)
// {
//   const form = document.createElement('form');
//   const lat = document.createElement('input');
//   const long = document.createElement('input');
//
//   lat.name = 'lat';
//   long.name = 'long';
//
//   lat.value = coords.lat;
//   long.value = coords.long;
//
//   form.appendChild(lat);
//   form.appendChild(long);
//
//   form.method = 'POST';
//   form.action = '/locations/' + lengthOfStay;
//
//   document.body.appendChild(form);
//
//   form.submit();
// }

/**
 * Append lat, long and length of stay to the login and register forms,
 * then prompt user to login or register.
 * @param  {Object} coords       JSON object containing lat and long coordinates of searched location.
 * @param  {String} lengthOfStay If the user is searching for 'short_term' or 'long_term' accommodation.
 */
function unsignedInSearch(coords, lengthOfStay)
{
  if (lengthOfStay == 'long_term') {
    const longTerm = document.getElementById('Long Term.');


    document.getElementById('latitude Long Term.').value = coords.lat;
    document.getElementById('longitude Long Term.').value = coords.long;
    document.getElementById('los Long Term.').value = lengthOfStay;

    $(longTerm).modal('show');
  } else if (lengthOfStay == 'short_term') {
    const shortTerm = document.getElementById('Right Now.');

    document.getElementById('latitude Right Now.').value = coords.lat;
    document.getElementById('longitude Right Now.').value = coords.long;
    document.getElementById('los Right Now.').value = lengthOfStay;

    $(shortTerm).modal('show');
  }

}

/**
 * Copies the latitude and longitude from the Google places autocomplete
 * object into a form.
 * @param  {Object}   autocomplete  Google places autocomplete object
 * @param  {Boolean}  isLongTerm    True if searching for long term accommodation, false otherwise.
 */
function search(autocomplete, isLongTerm) // Fills form with lat and long from the Google Maps API
{
  // const user = document.getElementById('userId');
  const lengthOfStay = isLongTerm ? 'long_term' : 'short_term';

  const address = document.getElementById('location').value;
  if (!address) { return; }

  const geocoder = new google.maps.Geocoder;
  const request = {
    address: address,
    componentRestrictions: {
      country: 'au'
    }
  }

  geocoder.geocode( request, (results, status) => {
    if (status == 'OK') {
      coords = {
        lat: results[0].geometry.location.lat(),
        long: results[0].geometry.location.lng()
      }
      // if(user) {
        // signedInSearch(coords, lengthOfStay);
      // } else {
      unsignedInSearch(coords, lengthOfStay);
      // }
    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
      return;
    }
  });
}

// const place = autocomplete.getPlace();
//
// if(!place) return;
//
// return coords = {
//   lat: place.geometry.location.lat(),
//   long: place.geometry.location.lng()
// }
