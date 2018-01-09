
function submitRequest(form)
{
  console.log(form.elements["location"].value);
  form.elements["location"].value = document.getElementById("locationForm").elements["location"].value;
  console.log(form.elements["location"].value);
  form.submit();
}
