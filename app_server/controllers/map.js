function getLatLng(suburb, state)
{
  var path = 'https://maps.googleapis.com/maps/api/geocode/json?address=Crawley,+WA,&key='+process.env.embed_maps_api;
  requestOptions = {
    url : path,
    method : "GET"
  };
  request( requestOptions, function(err, response, body1) {

    var body = JSON.parse(body1);
    if(err || response.statusCode != 200)
    {
      //error
    }
    else
    {
      //Do what you want with the location
      var val = {
        lat: body.results[0].geometry.location.lat,
        lng: body.results[0].geometry.location.lng
      };

      console.log(val);
    }

  } );

}
