function setImageListeners() {

  /**
   *  jQuery form listener to upload a new image.
   *
   *  Triggered when a file is selected using the file selection box
   */
  $('#fileAdd').on('change', function (event) {

    // Show the loading spinner and toggle inputs
    $('#plus-img').hide();
    $('#spinner-gif').show();
    $('#alertBox').hide('slide');
    toggleInputs();

    // Get the uploaded file from the form and store it in a FormData object
    let uploadedFile = $('#fileAdd').prop("files")[0];
    var formData = new FormData();
    formData.append('fileAdd', uploadedFile, uploadedFile.name);

    // Upload the FormData object to the server in a POST request
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/add",
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        if (!data.error) {
          // File upload successful - add the images mediaLink to the rightmost thumbnail and modal
          let index = $('.item:visible').length - 2;
          $('#img' + index).attr('src', data.mediaLink);
          $('#deleteImg' + index).attr('src', data.mediaLink);
          $('#imageCount').text((index + 1) + "/6")
          $('#plus-img').show();
          $('#spinner-gif').hide();
          toggleInputs();

          // If 5 (max-1) images have been uploaded, disable the file add button
          if (index === 5) {
            $('#itemAdd').toggle('slide')
          }

          // Display new image
          $('#item' + index).toggle('slide');
        } else {
          // File upload unsuccessful - display the error and description in the alert box
          $('#alertBox').html("<strong>" + data.errorTitle + " </strong>" + data.errorDescription).show('slide');
          $('#plus-img').show();
          $('#spinner-gif').hide();
          toggleInputs();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // If the response contained an error, print the error in the alert box
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

  /**
   *  jQuery form listener to upload a new logo.
   *
   *  Triggered when a file is selected using the file selection box
   */
  $('#logoAdd').on('change', function (event) {

    console.log("logoAdd triggered");

    // Show the loading spinner and toggle inputs
    $('#plusLogo-img').hide();
    $('#spinnerLogo-gif').show();
    $('#alertBox').hide('slide');
    toggleInputs();

    // Get the uploaded file from the form and store it in a FormData object
    let uploadedFile = $('#logoAdd').prop("files")[0];
    var formData = new FormData();
    formData.append('logoAdd', uploadedFile, uploadedFile.name);

    // Upload the FormData object to the server in a POST request
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/logo/add",
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        if (!data.error) {
          // File upload successful - change the images mediaLink to the thumbnail and modal
          $('#logoImg').attr('src', data.mediaLink);
          console.log(data.mediaLink);
          $('#deleteLogoImg').attr('src', data.mediaLink);

          // Enable the images and hide the spinner, then toggle the inputs
          $('#logoLink').show();
          $('#logoLabel').hide();
          $('#spinnerLogo-gif').hide();
          toggleInputs();
        } else {
          // File upload unsuccessful - display the error and description in the alert box
          $('#alertBox').html("<strong>" + data.errorTitle + " </strong>" + data.errorDescription).show('slide');
          $('#plusLogo-img').show();
          $('#spinnerLogo-gif').hide();
          toggleInputs();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // If the response contained an error, print the error in the alert box
        if (jqXHR.responseText.indexOf("File too large") !== -1) {
          $('#alertBox').html("<strong>File too large!</strong> Maximum file size is 2MB").show('slide');
        } else {
            $('#alertBox').html("<strong>Failure! </strong>" + errorThrown).show('slide');
        }
        $('#plusLogo-img').show();
        $('#spinnerLogo-gif').hide();
        toggleInputs();
      }
    });
  })
}

/**
 *  Delete the specified image from the Service using an AJAX POST request
 *
 *  @param {number} index The index of the image [0, 5]
 */
function deleteImage(index) {

  // Show the loading spinner, toggle inputs, and hide the modal
  $('#plus-img').hide();
  $('#spinner-gif').show();
  $('#alertBox').hide('slide');
  $('#deleteimagemodal-image' + index).modal('hide');
  toggleInputs();

  // Make an AJAX POST request to delete the image at 'index'
  let url = '/service/profile/' + $('#uri').text() + '/' + index + '/delete';
  $.post(url, function(data) {
    // If the image was successfully deleted
    if (!data.error) {

      // Hide the UI, and once the animation has completed...
      $('#item' + index).toggle('slide', function() {
        // Delete the old image HTML
        $('#item' + index).remove();
        $('#deleteimagemodal-image' + index).remove();

        /*
         *  Fix indexes
         *  The images need to be removed, and all the others shifted
         *  to the left by one, to match the backend
         */
        for (let i = index + 1; i < 6; i++) {
          $('#item' + i).attr('id', 'item' + (i - 1).toString());
          $('#img' + i).attr('id', 'img' + (i - 1).toString());
          $('#deleteimagemodal-image' + i).attr('id', 'deleteimagemodal-image' + (i - 1).toString());
          $('#deleteImg' + i).attr('id', 'deleteImg' + (i - 1).toString());
          $('#deleteimagebutton-image' + i).attr('id', 'deleteimagebutton-image' + (i - 1).toString()).attr('onclick', 'deleteImage(' + (i - 1).toString() + ')');
          $('#imagethumbnailmodal' + i).attr('id', 'imagethumbnailmodal' + (i - 1).toString()).attr('data-target', '#deleteimagemodal-image' + (i - 1).toString());
        }

        // Add blank (hidden) image thumbnail, to replace the one just deleted
        addBlankThumbnail();

        // Hide spinner and update the image count
        $('#plus-img').show();
        $('#spinner-gif').hide();
        let len = $('.item:visible').length - 2;

        // If an image was just deleted and the images were 6 images previously, show the add image icon again
        if (len === 4 && $('#itemAdd').is(':hidden')) {
          $('#itemAdd').toggle('slide');
          len += 1;
        }
        $('#imageCount').text(len + "/6")
        toggleInputs();
      });

    } else {
      // Display error in the alert box and re-enable inputs
      $('#plus-img').show();
      $('#spinner-gif').hide();
      response = xhr.responseText ? JSON.parse(xhr.responseText) : JSON.parse(xhr.responseXML);
      $('#alertBox').html("<strong>Error! </strong>" + response.message).show('slide');
      toggleInputs();
    }
  }).fail(function(xhr, status, error) {
    // Display error in the alert box and re-enable inputs
    $('#plus-img').show();
    $('#spinner-gif').hide();
    response = JSON.parse(xhr.responseText);
    $('#alertBox').html("<strong>Failure! </strong>" + response.message).show('slide');
    toggleInputs();
  });
}

/**
 *  Delete the logo from the Service using an AJAX POST request
 */
function deleteLogo() {

  // Show the loading spinner, toggle inputs, and hide the modal
  $('#plusLogo-img').hide();
  $('#spinnerLogo-gif').show();
  $('#logoLink').hide();
  $('#logoLabel').show();
  $('#alertBox').hide('slide');
  $('#deletelogomodal').modal('hide');
  toggleInputs();

  let url = '/service/profile/' + $('#uri').text() + '/logo/delete';
  $.post(url, function(data) {
    if (!data.error) {
      // Disable the old image thumbnail, and re-enable the add image button
      $('#logoImg').attr('src', '');
      $('#deleteLogoImg').attr('src', '');
      $('#spinnerLogo-gif').hide();
      $('#plusLogo-img').show();
      toggleInputs();
    } else {
      // Display error in the alert box and re-enable inputs
      $('#plus-img').show();
      $('#spinner-gif').hide();
      response = xhr.responseText ? JSON.parse(xhr.responseText) : JSON.parse(xhr.responseXML);
      $('#alertBox').html("<strong>Error! </strong>" + response.message).show('slide');
      toggleInputs();
    }
  }).fail(function(xhr, status, error) {
    // Display error in the alert box and re-enable inputs
    $('#plus-img').show();
    $('#spinner-gif').hide();
    response = JSON.parse(xhr.responseText);
    $('#alertBox').html("<strong>Failure! </strong>" + response.message).show('slide');
    toggleInputs();
  });
}

/**
 *  Contains the stringified HTML for a thumbnail, including the modal
 *
 *  @return {string} The stringified HTML of the thumbnail
 */
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

/**
 *  Toggles the inputs for the page, including the image and logo uploading buttons,
 *  and the deletion buttons on each of the image modals
 */
function toggleInputs() {
  $('#fileAdd').prop('disabled', function(i, v) { return !v; });
  $('#logoAdd').prop('disabled', function(i, v) { return !v; });
  for (let i = 0; i < 6; i++) {
    $('#deleteimagebutton-image' + i).toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
  }
  $('#deletelogobutton').toggleClass('disabled').prop('disabled', function(i, v) { return !v; });
}
