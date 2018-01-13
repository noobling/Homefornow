//Submit request
function submitRequest(form)
{
  // TODO: validation code
  form.elements["location"].value = document.getElementById("locationForm").elements["location"].value;
  form.submit();
}

// Submit phoneNumber with Ajax to prevent page reload
// https://stackoverflow.com/questions/25983603/how-to-submit-html-form-without-redirection
function submitPhoneNumber (form)
{
    $(document).ready(
      $.ajax({
        url:"/locations/contact",
        type:"POST",
        data:$(form).serialize(),
      })
      .fail(function(jqXHR, textStatus) {
        console.log("Error submitting phone number: " + textStatus);
      })
    );
};
