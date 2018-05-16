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
  localStorage.number = form.elements.number.value; 
  localStorage.email = form.elements.email.value; 
  Array.from(document.forms).forEach(function(f) {
    if (f.elements.email) {
      if (localStorage.email) {
        f.elements.email.value = localStorage.email;
      }
    }
    if (f.elements.number) {
      if (localStorage.number) {
        f.elements.number.value = localStorage.number;
      }
    }
  })
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
    console.log("[ERROR]: Contact information submission: " + textStatus);
  })
};
