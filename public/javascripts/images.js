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

function deleteImage(index) {
  $('#plus-img').hide();
  $('#spinner-gif').show();
  $('#alertBox').hide('slide');
  $('#deleteimagemodal-image' + index).modal('hide');
  toggleInputs();

  let url = '/service/dashboard/profile/' + $('#uri').text() + '/' + index + '/delete';
  $.post(url, function(data) {
    if (!data.error) {
      /* Update the UI
      alert('No error!');
      $('#deleteimagemodal-image' + index).modal('hide').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
      $('#deleteimagebutton-image' + index).attr('onclick', 'deleteImage(' + index + ')')
      let len = $('.item:visible').length - 2;
      $('#img' + index).attr('src', '#');
      $('#item' + index).toggle('slide');
      $('#deleteImg' + index).attr('src', '#');
      $('#imageCount').text((len - 1) + "/6")
      toggleInputs();*/

      // Hide the UI
      $('#item' + index).toggle('slide', function() {
        // Delete the old image HTML
        $('#item' + index).remove();
        $('#deleteimagemodal-image' + index).remove();

        // Fix indexes
        for (let i = index + 1; i < 6; i++) {
          $('#item' + i).attr('id', 'item' + (i - 1).toString());
          $('#img' + i).attr('id', 'img' + (i - 1).toString());
          $('#deleteimagemodal-image' + i).attr('id', 'deleteimagemodal-image' + (i - 1).toString());
          $('#deleteImg' + i).attr('id', 'deleteImg' + (i - 1).toString());
          $('#deleteimagebutton-image' + i).attr('id', 'deleteimagebutton-image' + (i - 1).toString()).attr('onclick', 'deleteImage(' + (i - 1).toString() + ')');
          $('#imagethumbnailmodal' + i).attr('id', 'imagethumbnailmodal' + (i - 1).toString()).attr('data-target', '#deleteimagemodal-image' + (i - 1).toString());
        }

        // Add blank (hidden) image thumbnail
        addBlankThumbnail();

        // Update UI
        $('#plus-img').show();
        $('#spinner-gif').hide();
        let len = $('.item:visible').length - 2;
        if (len === 4 && $('#itemAdd').is(':hidden')) {
          $('#itemAdd').toggle('slide');
          len += 1;
        }
        $('#imageCount').text(len + "/6")
        toggleInputs();
      });

    } else {
      // Display error
      $('#plus-img').show();
      $('#spinner-gif').hide();
      response = xhr.responseText ? JSON.parse(xhr.responseText) : JSON.parse(xhr.responseXML);
      $('#alertBox').html("<strong>Error! </strong>" + response.message).show('slide');
      toggleInputs();
    }
  }).fail(function(xhr, status, error) {
    // Display error TODO Potentially log information here
    $('#plus-img').show();
    $('#spinner-gif').hide();
    response = JSON.parse(xhr.responseText);
    $('#alertBox').html("<strong>Failure! </strong>" + response.message).show('slide');
    toggleInputs();
  });
}

function addBlankThumbnail() {
  $('#imagerow').append(
    '<div id="deleteimagemodal-image5" role="dialog" class="modal fade">' +
      '<div class="modal-dialog modal-sm">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<button type="button" data-dismiss="modal" class="close">&times;</button>' +
            '<h3>Delete this image?</h3>' +
          '</div>' +
          '<div class="modal-header text-center">' +
            '<div class="image"><img id="deleteImg5" class="img img-responsive"/></div>' +
          '</div>' +
          '<div class="modal-body text-center">' +
            '<div id="deleteimagebutton-image5" onclick="deleteImage(5)" class="btn btn-danger">Delete</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div style="display: none;" id="item5" class="item col-xs-4 col-sm-2">' +
      '<div class="thumbnail">' +
        '<div class="image highlight"><a href="#" data-toggle="modal" data-target="#deleteimagemodal-image5"><img id="img5" class="img-responsive"/></a></div>' +
      '</div>' +
    '</div>'
  );
}

function toggleInputs() {
  $('#fileAdd').prop('disabled', function(i, v) { return !v; });
  $('#logoAdd').prop('disabled', function(i, v) { return !v; });
  for (let i = 0; i < 6; i++) {
    $('#deleteimagebutton-image' + i).toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  }
  $('#deletelogobutton').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
}
