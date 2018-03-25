//Submit request
function submitRequest(form)
{
  // TODO: validation code
  locationForm = document.getElementById("locationForm");
  // form.elements["location"].value = locationForm.elements["locationInput"].value;
  // form.elements["lat"].value = locationForm.elements["lat"].value;
  // form.elements["long"].value = locationForm.elements["long"].value;
  form.submit();
}

// Submit phoneNumber with Ajax to prevent page reload
// https://stackoverflow.com/questions/25983603/how-to-submit-html-form-without-redirection
function submitPhoneNumber (form)
{
  console.log($(form).serialize());
  $.ajax({
    url: "/request/update",
    type: "post",
    data: $(form).serialize(),
    success: function(data)
    {
      console.log(data);
    },
  })
  .fail(function(jqXHR, textStatus) {
    console.log("[ERROR] Phone number submission: " + textStatus);
  })
};
