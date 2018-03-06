/**
 *
 *
 */
$('#fileAdd').on('change', function (event) {
  $('#plus-img').hide();
  $('#spinner-gif').show();
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
        $('#alertBox').html("<strong>Error! </strong>Image failed to upload!").show();
        $('#plus-img').show();
        $('#spinner-gif').hide();
        toggleInputs();
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      // TODO: Fix this so it doesn't print a stack trace
      $('#alertBox').html("<strong>Failure! </strong>" + jqXHR.responseText);
      $('#plus-img').show();
      $('#spinner-gif').hide();
      toggleInputs();
    }
  });
});

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
