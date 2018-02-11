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
 * [getCoords description]
 * @param  {Object} autocomplete Google places autocomplete object
 * @return {Object}              JSON object containing lat and long coordinates.
 */
function getCoords(autocomplete)
{
  const place = autocomplete.getPlace();

  if(!place) return;

  return coords = {
    lat: place.geometry.location.lat(),
    long: place.geometry.location.lng()
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
  const coords = getCoords(autocomplete);

  if(!coords) {
    console.log('Invalid location.');
    return;
  }

  const user = document.getElementById('userId');
  const lengthOfStay = isLongTerm ? 'long_term' : 'short_term';

  if(user) {
    // Create a form to submit lat and long
    const form = document.createElement('form');
    const lat = document.createElement('input');
    const long = document.createElement('input');

    lat.name = 'lat';
    long.name = 'long';

    lat.value = coords.lat;
    long.value = coords.long;

    form.appendChild(lat);
    form.appendChild(long);

    form.method = 'POST';
    form.action = '/locations/' + lengthOfStay;

    document.body.appendChild(form);

    form.submit();
  } else {
    // Append lat and long to login and register forms
    loginForm = document.getElementById('loginForm');
    regForm = document.getElementById('registerForm');

    loginForm.elements['lat'].value = coords.lat;
    loginForm.elements['long'].value = coords.long;
    loginForm.elements['lengthOfStay'].value = lengthOfStay;

    regForm.elements['lat'].value = coords.lat;
    regForm.elements['long'].value = coords.long;
    regForm.elements['lengthOfStay'].value = lengthOfStay;

    $('#regloginmodal').modal('show');
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

// /**
//  * Input location functionality.
//  * Gets the address typed in by the user and
//  * sends the latitude and longitude into a form.
//  */
// $(document).ready(() => {
//     $('#location').change(() => {
//         const lat = document.getElementById('lat').value;
//         const lng = document.getElementById('long').value;
//         let templat, templong;
//
//         const address = document.getElementById('location').value;
//         const geocoder = new google.maps.Geocoder;
//         geocoder.geocode( { 'address': address }, (results, status) => {
//             if (status == 'OK')
//             {
//                 templat = results[0].geometry.location.lat();
//                 templong = results[0].geometry.location.lng();
//
//                 if( lat != templat || lng != templong )
//                 {
//                     document.getElementById('lat').value = templat;
//                     document.getElementById('long').value = templong;
//                 }
//             }
//             else
//             {
//                 console.log('Geocode was not successful for the following reason: ' + status);
//             }
//         });
//     })
// })
