/**
 *
 *
 */
$('#fileAdd').on('change', function (event) {
  $('#plus-img').hide();
  $('#spinner-gif').show();
  $('#alertBox').hide('slide');
  toggleInputs();

  let uploadedFile = $('#fileAdd').prop("files")[0];
  var formData = new FormData();
  formData.append('fileAdd', uploadedFile, uploadedFile.name);

  $.ajax({
    url: "/service/dashboard/profile/" + $('#uri').text() + "/add",
    type: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data) {
      if (!data.error) {
        let index = $('.item:visible').length - 2;
        console.log('Index = ' + index);
        $('#img' + index).attr('src', data.mediaLink);
        $('#deleteImg' + index).attr('src', data.mediaLink);
        $('#imageCount').text((index + 1) + "/6")
        $('#plus-img').show();
        $('#spinner-gif').hide();
        toggleInputs();
        if (index === 5) {
          $('#itemAdd').toggle('slide')
        }
        $('#item' + index).toggle('slide');
      } else {
        $('#alertBox').html("<strong>" + data.errorTitle + " </strong>" + data.errorDescription).show('slide');
        $('#plus-img').show();
        $('#spinner-gif').hide();
        toggleInputs();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.responseText.indexOf("File too large") !== -1) {
        $('#alertBox').html("<strong>File too large!</strong> Maximum file size is 2MB").show('slide');
      } else {
          $('#alertBox').html("<strong>Failure! </strong>" + errorThrown).show('slide');
      }
      $('#plus-img').show();
      $('#spinner-gif').hide();
      toggleInputs();
    }
  });
});

/*$('deleteimagebutton-image0').bind('click', function() { deleteImage(0) });
$('deleteimagebutton-image1').bind('click', function() { deleteImage(1) });
$('deleteimagebutton-image2').bind('click', function() { deleteImage(2) });
$('deleteimagebutton-image3').bind('click', function() { deleteImage(3) });
$('deleteimagebutton-image4').bind('click', function() { deleteImage(4) });
$('deleteimagebutton-image5').bind('click', function() { deleteImage(5) });

function deleteImage(imageIndex) {
  alert('deleteImage called!');
  toggleInputs();
  let url = '/service/dashboard/profile/' + $('#uri').text() + '/' + imageIndex + '/delete';
  $.post(url, function(data) {
    if (!data.error) {
      // Update the UI
      alert('No error!');
      toggleInputs();
    } else {
      // Display error
      alert('Error occurred!');
      toggleInputs();
    }
  }).fail(function(xhr, status, error) {
    // Display error TODO Potentially log information here
    alert('Failure occurred!');
    toggleInputs();
  });
}*/

function toggleInputs() {
  $('#fileAdd').prop('disabled', function(i, v) { return !v; });
  $('#logoAdd').prop('disabled', function(i, v) { return !v; });
  $('#deleteimagebutton-image0').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  $('#deleteimagebutton-image1').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  $('#deleteimagebutton-image2').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  $('#deleteimagebutton-image3').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  $('#deleteimagebutton-image4').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  $('#deleteimagebutton-image5').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  $('#deletelogobutton').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
}
