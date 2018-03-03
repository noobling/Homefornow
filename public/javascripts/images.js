/**
 *
 *
 */
$('#fileAdd').on('change', function (event) {
  $('#plus-img').hide();
  $('#spinner-gif').show();

  let uploadedFile = $('#fileAdd').prop("files")[0];
  var formData = new FormData();

  formData.append('fileAdd', uploadedFile, uploadedFile.name);
  let uri = $('#uri').text();

  $.ajax({
    url: "/service/dashboard/profile/" + uri + "/add",
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
        if (index === 5) {
          $('#itemAdd').animate({width: "toggle", opacity: "toggle"}, 600);
          $('#item' + index).animate({width: "toggle", opacity: "toggle"}, 800);
        } else {
          $('#item' + index).animate({width: "toggle", opacity: "toggle"}, 800);
        }
      } else {
        $('#alertBox').html("<strong>Error! </strong>Image failed to upload!").show();
        $('#plus-img').show();
        $('#spinner-gif').hide();
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      // TODO: Fix this so it doesn't print a stack trace
      $('#alertBox').html("<strong>Failure! </strong>" + jqXHR.responseText);
      $('#plus-img').show();
      $('#spinner-gif').hide();
    }
  });
});
