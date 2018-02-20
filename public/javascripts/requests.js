/**
 * Submits the form contianing the youth person's request.
 * @param  {Object} form The form to submit.
 */
function submitRequest(form)
{
  // TODO: validation code
  locationForm = document.getElementById("locationForm");
  form.elements["location"].value = locationForm.elements["location"].value;
  form.elements["lat"].value = locationForm.elements["lat"].value;
  form.elements["long"].value = locationForm.elements["long"].value;
  form.submit();
}

// /**
//  * Submits the form containing the youth person's phone number.
//  * Uses Ajax to prevent a page reload.
//  * @param  {Object} form The form to submit.
//  */
// function submitPhoneNumber (form)
// {
//     // https://stackoverflow.com/questions/25983603/how-to-submit-html-form-without-redirection
//     $(document).ready(
//       $.ajax({
//         url:"/locations/contact",
//         type:"POST",
//         data:$(form).serialize(),
//       })
//       .fail(function(jqXHR, textStatus) {
//         console.log("[ERROR] Phone number submission: " + textStatus);
//       })
//     );
// };
