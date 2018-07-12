'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bedIndex = 0;

$.ajaxSetup({ cache: false });

$('#editBedModal').on('show.bs.modal', function () {
  $('#spinnerAddBeds').show();
  $('#bedList').hide();
  $.ajax({
    url: '/service/dashboard/' + $('#uri').text() + '/beds/show',
    method: 'GET',
    success: function success(data) {
      for (var i = 0; i < data.service.beds.length; i++) {
        var bed = data.service.beds[i];
        $('#bedList').append(BedPanel({
          index: bedIndex,
          name: bed.name
        }));
        $('#bedGender'.concat(bedIndex)).val(bed.gender);
        $('#bedType'.concat(bedIndex)).val(bed.bedType);
        bedIndex++;
      }
      $('#spinnerAddBeds').hide();
      $('#bedList').slideDown(500);
    }
  });
});

$('#editBedModal').on('hidden.bs.modal', function () {
  $('#bedList').html('');
  bedIndex = 0;
});

$('#addBed').click(function () {
  $('#bedList').append(BedPanel({ index: bedIndex++, name: "" }));
});

$('#bedList').on('click', '[href="Remove Bed"]', function (event) {
  event.preventDefault();
  $(this).closest('div.panel.shadow').remove();
});

$('#bedForm').submit(function (event) {
  event.preventDefault();
  var submit_button = $(this).find(':submit');
  var spinner = $(this).find('#spinnerConfirmBeds');
  submit_button.hide(100);
  spinner.show(100);

  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = $(this).serialize(); //Encode form elements for submission

  $.ajax({
    url: post_url,
    type: request_method,
    data: form_data
  }).done(function (response) {
    spinner.hide();
    submit_button.show();
    $('#editBedModal').modal('hide');
    updateBeds();
    return;
  });
});

var BedPanel = function BedPanel(_ref) {
  var index = _ref.index,
      name = _ref.name;
  return '\n  <div class="panel shadow">\n    <div class="panel-body">\n      <div class="row text-center" style=\'padding-top: 16px;\'>\n        <div class="col-sm-3 col-xs-6">\n          <input type="text" name="beds[' + index + '][name]" id="bedName' + index + '" value="' + name + '" required placeholder="Bed Name" class="form-control"/>\n        </div>\n        <div class="col-sm-3 col-xs-6">\n          <select name="beds[' + index + '][gender]" id="bedGender' + index + '" required class="form-control">\n            <option hidden=\'true\'>Gender</option>\n            <option value=\'Male\'>Male</option>\n            <option value=\'Female\'>Female</option>\n            <option value=\'Either\'>Either</option>\n          </select>\n        </div>\n        <div class="col-sm-3 col-xs-6">\n          <select name="beds[' + index + '][bedType]" id="bedType' + index + '" required class="form-control">\n            <option hidden=\'true\'>Bed Type</option>\n            <option value=\'Single\'>Single</option>\n            <option value=\'ParentChild\'>Parent with Child</option>\n          </select>\n        </div>\n        <div class="col-sm-3 col-xs-6">\n          <a href="Remove Bed" class="btn btn-primary">\n             Remove Bed\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n';
};

/**
 *  TODO: COMMENT
 */
$(document).ready(function () {
  updateBeds();

  updateRequests();

  fetchBedsAvailable();
});

/**
 *  When the user clicks the Bed Management tab
 */
$('a[href="#bedManagement"]').on('click', function () {
  updateBeds();

  updateRequests();
});

function updateBeds() {
  $('#updateBeds > .form-group').html('');
  $('#updateBeds > .form-group').hide();
  $('#spinnerLoadBeds').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/beds/show', function (data) {
    var index = 0;
    for (var i = 0; i < data.service.beds.length; i++) {
      var bed = data.service.beds[i];
      $('#updateBeds > .form-group').append(UpdatePanel({
        index: index,
        name: bed.name
      }));
      $('#available' + index).prop('checked', bed.isOccupied === 'Available');
      $('#pending' + index).prop('checked', bed.isOccupied === 'Pending');
      $('#unavailable' + index).prop('checked', bed.isOccupied === 'Unavailable');
      $('#bedtype' + index).text(bed.bedType);
      index++;
    }
    $('#spinnerLoadBeds').hide();
    $('#updateBeds > .form-group').slideDown(500);
  });
}

$('#updateBeds').submit(function (event) {
  event.preventDefault();
  var submit_button = $(this).find(':submit');
  var spinner = $(this).find('#spinnerUpdateBeds');

  submit_button.hide();
  spinner.show();

  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = $(this).serialize(); //Encode form elements for submission

  $.ajax({
    url: post_url,
    type: request_method,
    data: form_data
  }).done(function (response) {
    spinner.hide();
    submit_button.show();
    return;
  });
});

function updateRequests() {
  $('#updateRequests > .form-group').html('');
  $('#updateRequests > .form-group').hide();
  $('#spinnerLoadRequests').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/requests/show', function (data) {
    var index = 0;
    for (var i = 0; i < data.requests.length; i++) {
      var request = data.requests[i];
      $('#updateRequests > .form-group').append(RequestPanel({
        index: index,
        name: request.firstName + ' ' + request.lastName,
        email: request.email,
        number: request.phoneNumber,
        age: getAge(request.dob),
        id: request._id,
        gender: request.gender
      }));
      $('#updateRequests > .form-group').append(requestModal(index, request));
      addListenersForUpdateNotes(index);
      index++;
    }
    $('#spinnerLoadRequests').hide();
    $('#updateRequests > .form-group').slideDown(500);
  });

  $('#closedRequests > .form-group').html('');
  $('#closedRequests > .form-group').hide();
  $('#spinnerLoadRequestsClosed').show();

  $.get('/service/dashboard/' + $('#uri').text() + '/closed_requests/show', function (data) {
    var index = 0;
    for (var i = 0; i < data.requests.length; i++) {
      var request = data.requests[i];
      var closedAt = new Date(request.closedAt);
      closedAt = closedAt.toLocaleDateString();
      $('#closedRequests > .form-group').append(ClosedRequestPanel({
        index: index,
        name: request.firstName + ' ' + request.lastName,
        email: request.email,
        number: request.phoneNumber,
        age: getAge(request.dob),
        gender: request.gender,
        closedAt: closedAt
      }));
      $('#closedRequests > .form-group').append(closedRequestModal(index, request));
      addListenersForClosedRequestModal(index);
      index++;
    }
    $('#spinnerLoadRequestsClosed').hide();
    $('#closedRequests > .form-group').slideDown(500);
  });
}

$('#updateRequests').submit(function (event) {
  event.preventDefault();
  var submit_button = $(this).find(':submit');
  var spinner = $(this).find('#spinnerUpdateRequests');

  submit_button.hide();
  spinner.show();

  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = $(this).serialize(); //Encode form elements for submission

  $.ajax({
    url: post_url,
    type: request_method,
    data: form_data
  }).done(function (response) {
    spinner.hide();
    submit_button.show();
    updateRequests();
    return;
  });
});

function sendData(data) {
  var submit_button = $(data).find(':submit');

  var post_url = $(data).attr("action"); //get form action url
  var request_method = $(data).attr("method"); //get form GET/POST method
  var form_data = $(data).serialize(); //Encode form elements for submission

  $.ajax({
    url: post_url,
    type: request_method,
    data: form_data
  }).done(function (response) {
    return;
  });
}

$('#smsForm').submit(function (event) {
  event.preventDefault();
  sendData('#smsForm');
});

$('#emailForm').submit(function (event) {
  event.preventDefault();
  sendData('#emailForm');
});

function getAge(date) {
  var today = Date.now();
  var age = new Date(today - new Date(date).getTime());
  return Math.abs(age.getUTCFullYear() - 1970);
}

var requestModal = function requestModal(index, request) {
  return '\n  <div class="modal fade" id="requestModal' + index + '">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <div class="modal-header">\n          <button type="button" data-dismiss="modal" class="close">&times;</button>\n          <p id="requestId' + index + '" style="display: none;">' + request['_id'] + '</p>\n          <h4 style="font-weight: bold;">' + request.firstName + ' ' + request.lastName + '\'s request</h4>      \n        </div>\n        <div class="modal-body">\n          <h4>Applied</h4>\n          <p>' + new Date(request.openedAt).toLocaleString() + '</p>\n          <h4 style="margin-top: 1em;">Notes</h4>\n          <textarea class="form-control" rows="5" id="requestNote' + index + '" style="resize:none;">' + request.note + '</textarea>\n          <button class="btn btn-primary" style="margin-top: 1em" id="updateNoteBtn' + index + '" type="button">Save note</button\n        </div>\n      </div>\n    </div>\n  </div>\n';
};

var closedRequestModal = function closedRequestModal(index, request) {
  return '\n  <div class="modal fade" id="closedRequestModal' + index + '">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <div class="modal-body">\n          <p id="closedRequestId' + index + '" style="display: none;">' + request['_id'] + '</p>\n          <h3>' + request.firstName + ' ' + request.lastName + '\'s request</h4>\n          <h4 style="margin-top: 2em;">Applied</h4>\n          <p>' + timeago().format(request.openedAt) + '</p>\n          <h4 style="margin-top: 1em;">Notes</h4>\n          <textarea class="form-control" rows="5" id="closedRequestNote' + index + '">' + request.note + '</textarea>\n          <button class="btn btn-primary" style="margin-top: 1em" id="closedUpdateNoteBtn' + index + '" type="button">Save note</button>\n          <button class="btn btn-secondary pull-right" style="margin-top: 1em" id="reopenClosedReqBtn' + index + '" type="button">Reopen Request</button>\n        </div>\n      </div>\n    </div>\n  </div>\n';
};

function addListenersForUpdateNotes(index) {
  $('#updateNoteBtn' + index).click(function () {
    var data = {
      '_id': $('#requestId' + index).text(),
      'note': $('#requestNote' + index).val()
    };
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/note/add",
      type: 'post',
      data: data,
      success: function success(data) {
        $('#requestModal' + index).modal('toggle');
      }
    });
  });
}

function addListenersForClosedRequestModal(index) {
  $('#reopenClosedReqBtn' + index).click(function () {
    $.ajax({
      url: $('#closedRequests').attr('action'),
      type: 'post',
      data: { '_id': $('#closedRequestId' + index).text() },
      success: function success(data) {
        updateRequests();
      }
    });
    $('#closedRequestModal' + index).modal('toggle');
  });
  $('#closedUpdateNoteBtn' + index).click(function () {
    var data = {
      '_id': $('#closedRequestId' + index).text(),
      'note': $('#closedRequestNote' + index).val()
    };
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/note/add",
      type: 'post',
      data: data,
      success: function success(data) {
        $('#closedRequestModal' + index).modal('toggle');
      }
    });
  });
}

var UpdatePanel = function UpdatePanel(_ref2) {
  var index = _ref2.index,
      name = _ref2.name;
  return '\n  <div class="panel shadow">\n    <div class="panel-body">\n      <div class="row text-center">\n        <div class="col-xs-6 col-sm-2">\n          <h4 id="bedtype' + index + '" style="text-transform: uppercase;">ICON</h4>\n        </div>\n        <div class="col-xs-6 col-sm-4">\n          <h4>' + name + '</h4>\n        </div>\n        <div class="col-xs-4 col-sm-2">\n          <h6>Available</h6>\n          <input type="radio" name="beds[' + index + '][isOccupied]" value="Available" id=\'available' + index + '\' />\n        </div>\n        <div class="col-xs-4 col-sm-2">\n          <h6>Pending</h6>\n          <input type="radio" name="beds[' + index + '][isOccupied]" value="Pending" id=\'pending' + index + '\' />\n        </div>\n        <div class="col-xs-4 col-sm-2">\n          <h6>Occupied</h6>\n          <input type="radio" name="beds[' + index + '][isOccupied]" value="Unavailable" id=\'unavailable' + index + '\' />\n        </div>\n      </div>\n    </div>\n  </div>\n';
};

var RequestPanel = function RequestPanel(_ref3) {
  var index = _ref3.index,
      name = _ref3.name,
      email = _ref3.email,
      number = _ref3.number,
      age = _ref3.age,
      id = _ref3.id,
      gender = _ref3.gender;

  var html = '\n    <div class="panel shadow" style=\'height: 10vh; min-height: 80px;\'>\n      <div class="panel-body" style="height: 100%;">\n      <div class="row text-center" style="height: 100%; display: flex; align-items: center;">\n          <div class="col-xs-6 col-sm-2">\n            <h4>' + gender + '</h4>\n          </div>\n          <div class="col-xs-6 col-sm-2">\n            <a href=\'#\' class=\'addEmail\' data-toggle=\'modal\' data-target=\'#emailmodal\' data-email=\'' + email + '\'>\n              <h5>' + email + '</h5>\n            </a>\n            ';
  var num = number.substring(0, 2);
  if (num !== '04') {
    html += '       <h5>' + number + '</h5>\n            ';
  } else {
    html += '        <a href=\'#\' class=\'addNum\' data-toggle=\'modal\' data-target=\'#smsmodal\' data-num=\'' + number + '\'>\n              <h5>' + number + '</h5>\n              </a>\n              ';
  }

  html += '      </div>\n          <div class="col-xs-6 col-sm-2">\n            <h4>' + name + '</h4>\n          </div>\n          <div class="col-xs-6 col-sm-1">\n              <h6>' + age + '</h6>\n          </div>\n          <div class="col-xs-6 col-sm-2">\n            <input type="checkbox" name=\'requests[' + index + ']\' value=\'' + id + '\' />\n          </div>\n          <div>\n            <a data-toggle="modal" data-target="#requestModal' + index + '" class="btn btn-primary">Notes</a>\n          </div>\n        </div>\n      </div>\n    </div>\n  ';
  return html;
};

$(document).on("click", ".addNum", function () {
  var number = $(this).data('num');
  number = '61' + number.substring(1, number.length);
  $(".modal-body #tosms").val(number);
});

$(document).on("click", ".addEmail", function () {
  var email = $(this).data('email');
  $(".modal-body #toemail").val(email);
});

var ClosedRequestPanel = function ClosedRequestPanel(_ref4) {
  var index = _ref4.index,
      name = _ref4.name,
      email = _ref4.email,
      number = _ref4.number,
      age = _ref4.age,
      gender = _ref4.gender,
      closedAt = _ref4.closedAt;

  var html = '\n  <div class="panel shadow" style=\'height: 10vh; min-height: 80px;\'>\n    <div class="panel-body" style="height: 100%">\n      <div class="row text-center" style="height: 100%; display: flex; align-items: center;">\n        <div class="col-xs-6 col-sm-2">\n          <h4>' + gender + '</h4>\n        </div>\n        <div class="col-xs-6 col-sm-2">\n          <a href=\'#\' class=\'addEmail\' data-toggle=\'modal\' data-target=\'#emailmodal\' data-email=\'' + email + '\'>\n            <h5>' + email + '</h5>\n          </a>\n          ';
  var num = number.substring(0, 2);
  if (num !== '04') {
    html += '       <h5>' + number + '</h5>\n            ';
  } else {
    html += '        <a href=\'#\' class=\'addNum\' data-toggle=\'modal\' data-target=\'#smsmodal\' data-num=\'' + number + '\'>\n              <h5>' + number + '</h5>\n              </a>\n              ';
  }
  html += '\n          </div>\n          <div class="col-xs-6 col-sm-2">\n            <h4>' + name + '</h4>\n          </div>\n          <div class="col-xs-6 col-sm-1">\n            <h6>' + age + '</h6>\n          </div>\n          <div class="col-xs-6 col-sm-2">\n            <h5>' + closedAt + '</h5>\n          </div>\n          <div>\n            <a data-toggle="modal" data-target="#closedRequestModal' + index + '" class="btn btn-primary">Notes</a>\n          </div>\n      </div>\n    </div>\n  ';
  return html;
};

/**
 *  When the user clicks the Service Profile tab
 */
$('a[href="#serviceProfile"]').on('click', function () {
  $('#addServiceForm').hide();
  $('#spinnerLoadProfile').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/profile', function (data) {
    $('#serveName').val(data.service.name);
    $('#serveType').val(data.service.serviceType);

    $('#serveSuburb').val(data.service.address.suburb);
    $('#serveState').val(data.service.address.state);
    $('#servePostcode').val(data.service.address.postcode);

    $('#serveMinAge').val(data.service.ageRange.minAge);
    $('#serveMaxAge').val(data.service.ageRange.maxAge);
    $('#serveStayLength').val(data.service.stayLength);

    $('#serveEmail').val(data.email);
    $('#servePhone').val(data.service.phoneNumber);

    $('#serveDesc').val(data.service.description);
    $('#serveAbout').val(data.service.about);
    $('#serveRules').val(data.service.houseRules);
    $('#thankyouMessage').val(data.service.thankyouMessage);

    if (data.service.settings === undefined || data.service.settings.allowTexts !== false) {
      $('#serveAllowTexts').prop('checked', true);
    }
    var $inputs = $('#serveAmenitiesForm :input');

    $inputs.each(function () {
      for (var i = 0; i < data.service.amenities.length; i++) {
        var amen = data.service.amenities[i];
        if (amen.name === this.id) {
          $(this).prop('checked', true);
        }
      }
    });
    $('#spinnerLoadProfile').hide();
    $('#addServiceForm').slideDown(1000);
  });

  $('#logoSpace').html('');
  $('#photoSpace').html('');
  $.get('/service/dashboard/' + $('#uri').text() + '/images', function (data) {
    createImages($('#uri').text(), data.data.logo, data.data.images);

    $('#loadingPhotoUploadRow').fadeOut(400, function () {
      $('#photoUploadRow').slideDown(1000);
    });
  });
});

function createImages(uri, logo, images) {
  var isIE = false;
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    isIE = true;
  }
  if (logo) {
    $('#logoSpace').append(ImagePanel({
      uri: uri,
      image: logo,
      index: -1
    }));
    $('#logoSpace').children('div[data=image]').show(0);
  } else {
    if (isIE) {
      $('#logoSpace').append(AddImagePanelIE({
        uri: uri,
        route: '/logo/add'
      }));
    } else {
      $('#logoSpace').append(AddImagePanel({
        uri: uri,
        route: '/logo/add'
      }));
    }
    $('#logoSpace').children('div[data=addImage]').show(0);
  }

  var index = 0;
  if (!images || images.length < 6) {
    if (isIE) {
      $('#photoSpace').append(AddImagePanelIE({
        uri: uri,
        route: '/add'
      }));
    } else {
      $('#photoSpace').append(AddImagePanel({
        uri: uri,
        route: '/add'
      }));
    }
    $('#photoSpace').children('div[data=addImage]').show(0);
  }
  if (images) {
    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      $('#photoSpace').append(ImagePanel({
        uri: uri,
        image: image,
        index: index++
      }));
    }
    $('#photoSpace').children('div[data=image]').each(function () {
      $(this).show(0);
    });
  }
}

/**
 *  Uploading logo image
 **/
$('#logoSpace').on('change', 'input:file', function (event) {
  console.log('logo add');
  event.preventDefault();

  var $plus = $(this).prevAll('#plus-img');
  var $spinner = $(this).prevAll('#spinner-gif');
  console.log($spinner);
  var $element = $(this);

  $plus.hide();
  $spinner.show();
  $('#alertBox').hide('slide');

  toggleInputs();

  // Get the uploaded file from the form and store it in a FormData object
  var uploadedFile = $(this).prop("files")[0];
  var formData = new FormData();
  formData.append('file', uploadedFile, uploadedFile.name);

  // Upload the FormData object to the server in a POST request
  $.ajax({
    url: "/service/profile/" + $('#uri').text() + "/logo/add",
    type: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(data) {
      if (!data.error) {
        toggleInputs();

        $element.closest('div[data=addImage]').hide(500, function () {
          $(this).remove();
        });

        $('#logoSpace').append(ImagePanel({
          uri: uri,
          image: data.mediaLink,
          index: '-logo'
        }));
        $('#logoSpace').children('div[data=image]').show(500);
      } else {
        // File upload unsuccessful - display the error and description in the alert box
        $('#alertBox').html("<strong>" + data.errorTitle + " </strong>" + data.errorDescription).show('slide');
        $plus.show();
        $spinner.hide();
        toggleInputs();
      }
    },
    error: function error(jqXHR, textStatus, errorThrown) {
      // If the response contained an error, print the error in the alert box
      if (jqXHR.responseText.indexOf("File too large") !== -1) {
        $('#alertBox').html("<strong>File too large!</strong> Maximum file size is 2MB").show('slide');
      } else {
        $('#alertBox').html("<strong>Failure! </strong>" + errorThrown).show('slide');
      }
      $plus.show();
      $spinner.hide();
      toggleInputs();
    }
  });
});

$('#logoSpace').on('click', '[id^=deleteimagebutton-image]', function (event) {
  event.preventDefault();

  var $element = $(this);

  toggleInputs();

  var url = '/service/profile/' + $('#uri').text() + '/logo/delete';
  $.post(url, function (data) {
    if (!data.error) {

      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');

      toggleInputs();

      $('#logoSpace').prepend(AddImagePanel({
        uri: $('#uri').text(),
        route: '/logo/add'
      }));
      $('#logoSpace').children('div[data=addImage]').show(500);

      $element.closest('div[id^=deleteimagemodal-image]').on('hidden.bs.modal', function () {
        $(this).closest('div[data=image]').hide(500, function () {
          $(this).remove();
        });
      });
    } else {
      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
      response = xhr.responseText ? JSON.parse(xhr.responseText) : JSON.parse(xhr.responseXML);
      $('#alertBox').html("<strong>Error! </strong>" + response.message).show('slide');
      toggleInputs();
    }
  }).fail(function (xhr, status, error) {
    $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
    response = JSON.parse(xhr.responseText);
    $('#alertBox').html("<strong>Failure! </strong>" + response.message).show('slide');
    toggleInputs();
  });
});

/**
 *  Uploading normal image
 **/
$('#photoSpace').on('change', 'input:file', function (event) {
  console.log('image add');
  event.preventDefault();

  var uploadedFile = $(this).prop("files")[0];

  if (uploadedFile) {

    var $plus = $(this).prevAll('#plus-img');
    var $spinner = $(this).prevAll('#spinner-gif');
    var $element = $(this);

    $plus.hide();
    $spinner.show();
    $('#alertBox').hide('slide');

    toggleInputs();

    // Get the uploaded file from the form and store it in a FormData object
    var _uploadedFile = $(this).prop("files")[0];
    var formData = new FormData();
    formData.append('file', _uploadedFile, _uploadedFile.name);

    // Upload the FormData object to the server in a POST request
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/add",
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: function success(data) {
        if (!data.error) {
          // File upload successful - change the images mediaLink to the thumbnail and modal
          toggleInputs();

          var photoCount = $('#photoSpace').find('div[data=image]').length;

          console.log(photoCount);

          $('#photoSpace').append(ImagePanel({
            uri: uri,
            image: data.mediaLink,
            index: photoCount++
          }));
          $('#photoSpace').children('div[data=image]').last().show(500);

          console.log(photoCount);

          // Enable the images and hide the spinner, then toggle the inputs
          if (photoCount < 6) {
            $plus.show();
            $spinner.hide();
          } else {
            $element.closest('div[data=addImage]').hide(500, function () {
              $(this).remove();
            });
          }
        } else {
          // File upload unsuccessful - display the error and description in the alert box
          $('#alertBox').html("<strong>" + data.errorTitle + " </strong>" + data.errorDescription).show('slide');
          $plus.show();
          $spinner.hide();
          toggleInputs();
        }
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        // If the response contained an error, print the error in the alert box
        if (jqXHR.responseText.indexOf("File too large") !== -1) {
          $('#alertBox').html("<strong>File too large!</strong> Maximum file size is 2MB").show('slide');
        } else {
          $('#alertBox').html("<strong>Failure! </strong>" + errorThrown).show('slide');
        }
        $plus.show();
        $spinner.hide();
        toggleInputs();
      }
    });
  }
});

$('#photoSpace').on('click', '[id^=deleteimagebutton-image]', function (event) {
  event.preventDefault();

  var $element = $(this);

  var index = $('#photoSpace').find('div[data=image]').index($element.closest('div[data=image]'));
  var count = $('#photoSpace').find('div[data=image]').length;

  console.log(count);

  toggleInputs();

  var url = '/service/profile/' + $('#uri').text() + '/' + index + '/delete';
  $.post(url, function (data) {
    if (!data.error) {

      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');

      toggleInputs();

      if (count == 6) {
        $('#photoSpace').prepend(AddImagePanel({
          uri: $('#uri').text(),
          route: '/add'
        }));
        $('#photoSpace').children('div[data=addImage]').show(500);
      }

      $element.closest('div[id^=deleteimagemodal-image]').on('hidden.bs.modal', function () {
        $(this).closest('div[data=image]').hide(500, function () {
          $(this).remove();
        });
      });
    } else {
      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
      response = xhr.responseText ? JSON.parse(xhr.responseText) : JSON.parse(xhr.responseXML);
      $('#alertBox').html("<strong>Error! </strong>" + response.message).show('slide');
      toggleInputs();
    }
  }).fail(function (xhr, status, error) {
    $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
    response = JSON.parse(xhr.responseText);
    $('#alertBox').html("<strong>Failure! </strong>" + response.message).show('slide');
    toggleInputs();
  });
});

/**
 *  Toggles the inputs for the page, including the image and logo uploading buttons,
 *  and the deletion buttons on each of the image modals
 */
function toggleInputs() {
  $('#photoUploadRow').find('input:file').each(function () {
    $(this).prop('disabled', function (i, v) {
      return !v;
    });
  });
  $('#photoUploadRow').find('a[id^=deleteimagebutton]').each(function () {
    $(this).prop('disabled', function (i, v) {
      return !v;
    });
    $(this).toggleClass('disabled');
  });
}

$('#photoUploadRow').on('click', 'a[id^=imagethumbnailmodal]', function (event) {
  console.log('open modal');
  event.preventDefault();
  $(this).closest('div[data=image]').children('div[id^=deleteimagemodal-image]').modal('show');
});

var ImagePanel = function ImagePanel(_ref5) {
  var uri = _ref5.uri,
      image = _ref5.image,
      index = _ref5.index;
  return '\n  <div class="col-sm-2 col-xs-6" data=\'image\' style=\'display: none;\'>\n    <div class=\'modal fade\' id=\'deleteimagemodal-image' + index + '\' role=\'dialog\'>\n      <div class=\'modal-dialog modal-sm\'>\n        <div class=\'modal-content\'>\n          <div class=\'modal-header\'>\n            <button class=\'close\' type=\'button\' data-dismiss=\'modal\'>&times;</button>\n            <h3>Delete this image?</h3>\n            <div class=\'text-center\'>\n              <div class=\'image\'>\n                <img class=\'img img-responsive\' id=\'deleteImg' + index + '\' src=\'' + image + '\' />\n              </div>\n            </div>\n          </div>\n          <div class=\'modal-body text-center\'>\n            <a class=\'btn btn-danger btn-lg\' id=\'deleteimagebutton-image' + index + '\'>\n              Delete\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\'thumbnail\'>\n      <div class=\'image highlight\'>\n        <a href=\'#\' id=\'imagethumbnailmodal' + index + '\' >\n          <img class=\'img-responsive\' src=\'' + image + '\'/>\n        </a>\n      </div>\n    </div>\n  </div>\n';
};

var AddImagePanel = function AddImagePanel(_ref6) {
  var uri = _ref6.uri,
      route = _ref6.route;
  return '\n  <div class="col-sm-2 col-xs-6" data="addImage" style="display: none;">\n    <form action=\'/service/profile/' + uri + route + '\' method=\'post\' enctype=\'multipart/form-data\'>\n      <div class=\'thumbnail\' style=\'line-height: 0px;\'>\n        <div class=\'image highlight\'>\n          <label style="margin: 0px;">\n            <img class=\'img-responsive\' id=\'plus-img\' src=\'/images/plus.png\' alt=\'Add Image\' style=\'cursor: pointer;\'/>\n            <img class=\'img-responsive\' id=\'spinner-gif\' src=\'/images/loading_spinner.gif\' style=\'display: none;\'/>\n            <input type=\'file\' accept=\'image/*\' hidden=\'\' name=\'fileAdd\' />\n          </label>\n        </div>\n      </div>\n    </form>\n  </div>\n';
};

var AddImagePanelIE = function AddImagePanelIE(_ref7) {
  var uri = _ref7.uri,
      route = _ref7.route;
  return '\n  <div class="col-sm-3 col-xs-6" data="addImage" style="display: none;">\n    <form action=\'/service/profile/' + uri + route + '\' method=\'post\' enctype=\'multipart/form-data\'>\n      <input type=\'file\' accept=\'image/*\' name=\'fileAdd\' />\n    </form>\n  </div>\n';
};

/**
 *  When the user clicks the Beds Available tab
 */
function fetchBedsAvailable() {
  $.get('/service/beds/available', function (services) {
    $('#spinnerBedsAvailable').hide();
    var numSegments = 1;
    var numAdded = 0;

    for (var i = 0; i < services.crisis.length; i++) {
      var service = services.crisis[i];

      $('#crisis-table').append('\n      <tr class="table-panel crisis-segment crisis-segment-' + numSegments + '">\n        <td class=\'crisis-table-service-name\'>' + service.serviceName + '</td>\n        <td>' + service.numBeds + '</td>\n        <td>' + service.numMale + '</td>\n        <td>' + service.numFemale + '</td>\n        <td>' + service.numEither + '</td>\n        <td>' + service.phoneNumber + '</td>\n      </tr>\n      ');

      numAdded++;

      // We reached the max number of items we want to show at once, time to create a new page to paginate the items
      if (numAdded >= 7) {
        numSegments++;
        numAdded = 0;
      }
    }
    $('.crisis-segment').hide();
    $('.crisis-segment-1').show();

    var links = '';
    for (var i = 0; i < numSegments; i++) {
      var num = i + 1;
      links += '<li><a href="#" class="crisis-table-link">' + num + '</a></li>';
    }

    $('#crisis-table').append('\n      <ul class=\'pagination\'>\n        ' + links + '\n      </ul>\n    ');

    $('.crisis-table-link').click(function (elem) {
      $('.crisis-segment').hide();
      $('.crisis-segment-' + elem.target.innerHTML).show();
    });

    for (var i = 0; i < services.transitional.length; i++) {
      var service = services.transitional[i];
      $('#transitional-table').append('\n        <tr class="table-panel">\n          <td>' + service.serviceName + '</td>\n          <td>' + service.phoneNumber + '</td>\n        </tr>\n      ');
    }
  });
}

$('#serveAmenitiesForm :input').click(function () {
  var id = $(this).attr('id');
  var checkedState = document.getElementById(id).checked;
  var data = {
    checkedState: checkedState,
    id: id
  };
  $.ajax({
    url: '/service/amenities/' + $('#uri').text() + '/update',
    method: 'POST',
    data: data,
    success: function success(data) {}
  });
});

/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v3.0.2
 * https://github.com/hustcc/timeago.js
**/
/* jshint expr: true */
!function (root, factory) {
  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    module.exports = factory(root); // nodejs support
    module.exports['default'] = module.exports; // es6 support
  } else root.timeago = factory(root);
}(typeof window !== 'undefined' ? window : undefined, function () {
  var indexMapEn = 'second_minute_hour_day_week_month_year'.split('_'),
      indexMapZh = '秒_分钟_小时_天_周_月_年'.split('_'),

  // build-in locales: en & zh_CN
  locales = {
    'en': function en(number, index) {
      if (index === 0) return ['just now', 'right now'];
      var unit = indexMapEn[parseInt(index / 2)];
      if (number > 1) unit += 's';
      return [number + ' ' + unit + ' ago', 'in ' + number + ' ' + unit];
    },
    'zh_CN': function zh_CN(number, index) {
      if (index === 0) return ['刚刚', '片刻后'];
      var unit = indexMapZh[parseInt(index / 2)];
      return [number + unit + '前', number + unit + '后'];
    }
  },

  // second, minute, hour, day, week, month, year(365 days)
  SEC_ARRAY = [60, 60, 24, 7, 365 / 7 / 12, 12],
      SEC_ARRAY_LEN = 6,

  // ATTR_DATETIME = 'datetime',
  ATTR_DATA_TID = 'data-tid',
      timers = {}; // real-time render timers

  // format Date / string / timestamp to Date instance.
  function toDate(input) {
    if (input instanceof Date) return input;
    if (!isNaN(input)) return new Date(toInt(input));
    if (/^\d+$/.test(input)) return new Date(toInt(input));
    input = (input || '').trim().replace(/\.\d+/, '') // remove milliseconds
    .replace(/-/, '/').replace(/-/, '/').replace(/(\d)T(\d)/, '$1 $2').replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
    .replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
    return new Date(input);
  }
  // change f into int, remove decimal. Just for code compression
  function toInt(f) {
    return parseInt(f);
  }
  // format the diff second to *** time ago, with setting locale
  function formatDiff(diff, locale, defaultLocale) {
    // if locale is not exist, use defaultLocale.
    // if defaultLocale is not exist, use build-in `en`.
    // be sure of no error when locale is not exist.
    locale = locales[locale] ? locale : locales[defaultLocale] ? defaultLocale : 'en';
    // if (! locales[locale]) locale = defaultLocale;
    var i = 0,
        agoin = diff < 0 ? 1 : 0,
        // timein or timeago
    total_sec = diff = Math.abs(diff);

    for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY_LEN; i++) {
      diff /= SEC_ARRAY[i];
    }
    diff = toInt(diff);
    i *= 2;

    if (diff > (i === 0 ? 9 : 1)) i += 1;
    return locales[locale](diff, i, total_sec)[agoin].replace('%s', diff);
  }
  // calculate the diff second between date to be formated an now date.
  function diffSec(date, nowDate) {
    nowDate = nowDate ? toDate(nowDate) : new Date();
    return (nowDate - toDate(date)) / 1000;
  }
  /**
   * nextInterval: calculate the next interval time.
   * - diff: the diff sec between now and date to be formated.
   *
   * What's the meaning?
   * diff = 61 then return 59
   * diff = 3601 (an hour + 1 second), then return 3599
   * make the interval with high performace.
  **/
  function nextInterval(diff) {
    var rst = 1,
        i = 0,
        d = Math.abs(diff);
    for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY_LEN; i++) {
      diff /= SEC_ARRAY[i];
      rst *= SEC_ARRAY[i];
    }
    // return leftSec(d, rst);
    d = d % rst;
    d = d ? rst - d : rst;
    return Math.ceil(d);
  }
  // get the datetime attribute, `data-timeagp` / `datetime` are supported.
  function getDateAttr(node) {
    return getAttr(node, 'data-timeago') || getAttr(node, 'datetime');
  }
  // get the node attribute, native DOM and jquery supported.
  function getAttr(node, name) {
    if (node.getAttribute) return node.getAttribute(name); // native
    if (node.attr) return node.attr(name); // jquery
  }
  // set the node attribute, native DOM and jquery supported.
  function setTidAttr(node, val) {
    if (node.setAttribute) return node.setAttribute(ATTR_DATA_TID, val); // native
    if (node.attr) return node.attr(ATTR_DATA_TID, val); // jquery
  }
  // get the timer id of node.
  // remove the function, can save some bytes.
  // function getTidFromNode(node) {
  //   return getAttr(node, ATTR_DATA_TID);
  // }
  /**
   * timeago: the function to get `timeago` instance.
   * - nowDate: the relative date, default is new Date().
   * - defaultLocale: the default locale, default is en. if your set it, then the `locale` parameter of format is not needed of you.
   *
   * How to use it?
   * var timeagoLib = require('timeago.js');
   * var timeago = timeagoLib(); // all use default.
   * var timeago = timeagoLib('2016-09-10'); // the relative date is 2016-09-10, so the 2016-09-11 will be 1 day ago.
   * var timeago = timeagoLib(null, 'zh_CN'); // set default locale is `zh_CN`.
   * var timeago = timeagoLib('2016-09-10', 'zh_CN'); // the relative date is 2016-09-10, and locale is zh_CN, so the 2016-09-11 will be 1天前.
  **/
  function Timeago(nowDate, defaultLocale) {
    this.nowDate = nowDate;
    // if do not set the defaultLocale, set it with `en`
    this.defaultLocale = defaultLocale || 'en'; // use default build-in locale
    // for dev test
    // this.nextInterval = nextInterval;
  }
  // what the timer will do
  Timeago.prototype.doRender = function (node, date, locale) {
    var diff = diffSec(date, this.nowDate),
        self = this,
        tid;
    // delete previously assigned timeout's id to node
    node.innerHTML = formatDiff(diff, locale, this.defaultLocale);
    // waiting %s seconds, do the next render
    timers[tid = setTimeout(function () {
      self.doRender(node, date, locale);
      delete timers[tid];
    }, Math.min(nextInterval(diff) * 1000, 0x7FFFFFFF))] = 0; // there is no need to save node in object.
    // set attribute date-tid
    setTidAttr(node, tid);
  };
  /**
   * format: format the date to *** time ago, with setting or default locale
   * - date: the date / string / timestamp to be formated
   * - locale: the formated string's locale name, e.g. en / zh_CN
   *
   * How to use it?
   * var timeago = require('timeago.js')();
   * timeago.format(new Date(), 'pl'); // Date instance
   * timeago.format('2016-09-10', 'fr'); // formated date string
   * timeago.format(1473473400269); // timestamp with ms
  **/
  Timeago.prototype.format = function (date, locale) {
    return formatDiff(diffSec(date, this.nowDate), locale, this.defaultLocale);
  };
  /**
   * render: render the DOM real-time.
   * - nodes: which nodes will be rendered.
   * - locale: the locale name used to format date.
   *
   * How to use it?
   * var timeago = require('timeago.js')();
   * // 1. javascript selector
   * timeago.render(document.querySelectorAll('.need_to_be_rendered'));
   * // 2. use jQuery selector
   * timeago.render($('.need_to_be_rendered'), 'pl');
   *
   * Notice: please be sure the dom has attribute `datetime`.
  **/
  Timeago.prototype.render = function (nodes, locale) {
    if (nodes.length === undefined) nodes = [nodes];
    for (var i = 0, len = nodes.length; i < len; i++) {
      this.doRender(nodes[i], getDateAttr(nodes[i]), locale); // render item
    }
  };
  /**
   * setLocale: set the default locale name.
   *
   * How to use it?
   * var timeago = require('timeago.js')();
   * timeago.setLocale('fr');
  **/
  Timeago.prototype.setLocale = function (locale) {
    this.defaultLocale = locale;
  };
  /**
   * timeago: the function to get `timeago` instance.
   * - nowDate: the relative date, default is new Date().
   * - defaultLocale: the default locale, default is en. if your set it, then the `locale` parameter of format is not needed of you.
   *
   * How to use it?
   * var timeagoFactory = require('timeago.js');
   * var timeago = timeagoFactory(); // all use default.
   * var timeago = timeagoFactory('2016-09-10'); // the relative date is 2016-09-10, so the 2016-09-11 will be 1 day ago.
   * var timeago = timeagoFactory(null, 'zh_CN'); // set default locale is `zh_CN`.
   * var timeago = timeagoFactory('2016-09-10', 'zh_CN'); // the relative date is 2016-09-10, and locale is zh_CN, so the 2016-09-11 will be 1天前.
   **/
  function timeagoFactory(nowDate, defaultLocale) {
    return new Timeago(nowDate, defaultLocale);
  }
  /**
   * register: register a new language locale
   * - locale: locale name, e.g. en / zh_CN, notice the standard.
   * - localeFunc: the locale process function
   *
   * How to use it?
   * var timeagoFactory = require('timeago.js');
   *
   * timeagoFactory.register('the locale name', the_locale_func);
   * // or
   * timeagoFactory.register('pl', require('timeago.js/locales/pl'));
   **/
  timeagoFactory.register = function (locale, localeFunc) {
    locales[locale] = localeFunc;
  };

  /**
   * cancel: cancels one or all the timers which are doing real-time render.
   *
   * How to use it?
   * For canceling all the timers:
   * var timeagoFactory = require('timeago.js');
   * var timeago = timeagoFactory();
   * timeago.render(document.querySelectorAll('.need_to_be_rendered'));
   * timeagoFactory.cancel(); // will stop all the timers, stop render in real time.
   *
   * For canceling single timer on specific node:
   * var timeagoFactory = require('timeago.js');
   * var timeago = timeagoFactory();
   * var nodes = document.querySelectorAll('.need_to_be_rendered');
   * timeago.render(nodes);
   * timeagoFactory.cancel(nodes[0]); // will clear a timer attached to the first node, stop render in real time.
   **/
  timeagoFactory.cancel = function (node) {
    var tid;
    // assigning in if statement to save space
    if (node) {
      tid = getAttr(node, ATTR_DATA_TID); // get the timer of DOM node(native / jq).
      if (tid) {
        clearTimeout(tid);
        delete timers[tid];
      }
    } else {
      for (tid in timers) {
        clearTimeout(tid);
      }timers = {};
    }
  };

  return timeagoFactory;
});