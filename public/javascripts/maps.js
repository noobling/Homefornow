$(function(){
  $('.geoloc').on('click', geoloc);
});

var geo = process.env.geoloc_api;

function geoloc()
{
  if (!navigator.geolocation)
  {
      alert("Geolocation is not supported by your browser");
  }
  function success(position)
  {
    axios.get('https://maps.googleapis.com/maps/api/geocode/json',
    {
      params:{
        address: position.coords.latitude +", "+ position.coords.longitude,
        key: geo
      }
    })
    .then(function(response)
    {
      var locality, state, country;
      var addressComponents = response.data.results[0].address_components;

      for (i = 0; i < addressComponents.length; ++i)
      {
        for (j = 0; j < addressComponents[i].types.length; ++j)
        {
          if (!country && addressComponents[i].types[j] == "country")
            country = addressComponents[i].long_name;
          else if (!state && addressComponents[i].types[j] == "administrative_area_level_1")
            state = addressComponents[i].long_name;
          else if (!locality && addressComponents[i].types[j] == "locality")
            locality = addressComponents[i].long_name;
        }
      }
      document.getElementById("location").value = locality + ", " + state + ", " + country;
    })
    .catch(function(error)
    {
      console.log(error);
    });
  }
  function error()
  {
    alert("Unable to retrieve your location");
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

function geocode(e)
{
  // Prevent actual submit
  e.preventDefault();
  var location = document.getElementById('location').value;
  axios.get('https://maps.googleapis.com/maps/api/geocode/json',
  {
    params:{
      address:location,
      key:geo
    }
  })
  .then(function(response)
  {
    // Log full response
    console.log(response);
    // Formatted Address
    var formattedAddress = response.data.results[0].formatted_address;
    // Address Components
    var addressComponents = response.data.results[0].address_components;
    // Geometry
    lat = response.data.results[0].geometry.location.lat;
    lng = response.data.results[0].geometry.location.lng;
    alert(formattedAddress+"\n"+lat+", "+lng);
  })
  .catch(function(error)
  {
    console.log(error);
  });
}

function initMap()
{
  var map = new google.maps.Map(document.getElementById('map'),
  {
    zoom: 14,
    center: {lat: -31.986, lng: 115.822},
    disableDefaultUI: true,
    zoomControl: true
  });
}
