var bedIndex = 0;

$.ajaxSetup({ cache: false })

$('#editBedModal').on('show.bs.modal', function() {
  $('#spinnerAddBeds').show();
  $('#bedList').hide();
  $.ajax({
    url: '/service/dashboard/' + $('#uri').text() + '/beds/show',
    method: 'GET',
    success: function(data) {
      for (var i = 0; i < data.service.beds.length; i++) {
        var bed = data.service.beds[i];
        $('#bedList').append(BedPanel({
          index: bedIndex,
          name: bed.name,
        }));
        $('#bedGender'.concat(bedIndex)).val(bed.gender);
        $('#bedType'.concat(bedIndex)).val(bed.bedType);
        bedIndex++;
      }
      $('#spinnerAddBeds').hide();
      $('#bedList').slideDown(500);
    },
  });
});

$('#editBedModal').on('hidden.bs.modal', function() {
  $('#bedList').html('');
  bedIndex = 0;
})

$('#addBed').click(function() {
  $('#bedList').append(BedPanel({ index: bedIndex++, name: "" }));
})

$('#bedList').on('click', '[href="Remove Bed"]', function(event) {
  event.preventDefault();
  $(this).closest('div.panel.shadow').remove();
})

$('#bedForm').submit(function( event ) {
  event.preventDefault();
  const submit_button = $(this).find(':submit');
  const spinner = $(this).find('#spinnerConfirmBeds');
  submit_button.hide(100);
  spinner.show(100);

  const post_url = $(this).attr("action"); //get form action url
  const request_method = $(this).attr("method"); //get form GET/POST method
  const form_data = $(this).serialize(); //Encode form elements for submission

  $.ajax({
    url : post_url,
    type: request_method,
    data : form_data,
  }).done(function(response) {
    spinner.hide();
    submit_button.show();
    $('#editBedModal').modal('hide');
    updateBeds();
    return;
  });
})

const BedPanel = ({ index, name }) => `
  <div class="panel shadow">
    <div class="panel-body">
      <div class="row text-center" style='padding-top: 16px;'>
        <div class="col-sm-3 col-xs-6">
          <input type="text" name="beds[${index}][name]" id="bedName${index}" value="${name}" required placeholder="Bed Name" class="form-control"/>
        </div>
        <div class="col-sm-3 col-xs-6">
          <select name="beds[${index}][gender]" id="bedGender${index}" required class="form-control">
            <option hidden='true'>Gender</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Either'>Either</option>
          </select>
        </div>
        <div class="col-sm-3 col-xs-6">
          <select name="beds[${index}][bedType]" id="bedType${index}" required class="form-control">
            <option hidden='true'>Bed Type</option>
            <option value='Single'>Single</option>
            <option value='ParentChild'>Parent with Child</option>
          </select>
        </div>
        <div class="col-sm-3 col-xs-6">
          <a href="Remove Bed" class="btn btn-primary">
             Remove Bed
          </a>
        </div>
      </div>
    </div>
  </div>
`;



/**
 *  TODO: COMMENT
 */
$(document).ready(function() {
  updateBeds();

  updateRequests();

  fetchBedsAvailable();
});

/**
 *  When the user clicks the Bed Management tab
 */
$('a[href="#bedManagement"]').on('click', function() {
  updateBeds();

  updateRequests();
});

function updateBeds() {
  $('#updateBeds > .form-group').html('');
  $('#updateBeds > .form-group').hide();
  $('#spinnerLoadBeds').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/beds/show', function(data) {
    let index = 0;
    for (var i = 0; i < data.service.beds.length; i++) {
      var bed = data.service.beds[i];
      $('#updateBeds > .form-group').append(UpdatePanel({
        index,
        name: bed.name
      }));
      $('#available'+index).prop('checked', bed.isOccupied === 'Available');
      $('#pending'+index).prop('checked', bed.isOccupied === 'Pending');
      $('#unavailable'+index).prop('checked', bed.isOccupied === 'Unavailable');
      $('#bedtype'+index).text(bed.bedType);
      index++;
    }
    $('#spinnerLoadBeds').hide();
    $('#updateBeds > .form-group').slideDown(500);
  });
}

$('#updateBeds').submit(function(event) {
  event.preventDefault();
  const submit_button = $(this).find(':submit');
  const spinner = $(this).find('#spinnerUpdateBeds');

  submit_button.hide();
  spinner.show();

  const post_url = $(this).attr("action"); //get form action url
  const request_method = $(this).attr("method"); //get form GET/POST method
  const form_data = $(this).serialize(); //Encode form elements for submission

  $.ajax({
    url : post_url,
    type: request_method,
    data : form_data,
  }).done(function(response) {
    spinner.hide();
    submit_button.show();
    return;
  });
});

function updateRequests() {
  $('#updateRequests > .form-group').html('');
  $('#updateRequests > .form-group').hide();
  $('#spinnerLoadRequests').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/requests/show', function(data) {
    let index = 0;
    for (var i = 0; i < data.requests.length; i++) {
      var request = data.requests[i];
      $('#updateRequests > .form-group').append(RequestPanel({
        index,
        name: request.firstName + ' ' + request.lastName,
        email: request.email,
        number: request.phoneNumber,
        age: getAge(request.dob),
        id: request._id,
        gender: request.gender
      }));
      $('#updateRequests > .form-group').append(requestModal(index, request))
      addListenersForUpdateNotes(index)
      index++;
    }
    $('#spinnerLoadRequests').hide();
    $('#updateRequests > .form-group').slideDown(500);
  });

  $('#closedRequests > .form-group').html('');
  $('#closedRequests > .form-group').hide();
  $('#spinnerLoadRequestsClosed').show();

  $.get('/service/dashboard/' + $('#uri').text() + '/closed_requests/show', function(data) {
    let index = 0;
    for (var i = 0; i < data.requests.length; i++) {
      var request = data.requests[i];
      let closedAt = new Date(request.closedAt);
      closedAt = closedAt.toLocaleDateString();
      $('#closedRequests > .form-group').append(ClosedRequestPanel({
        index,
        name: request.firstName + ' ' + request.lastName,
        email: request.email,
        number: request.phoneNumber,
        age: getAge(request.dob),
        gender: request.gender,
        closedAt
      }));
      $('#closedRequests > .form-group').append(closedRequestModal(index, request));
      addListenersForClosedRequestModal(index)
      index++;
    }
    $('#spinnerLoadRequestsClosed').hide();
    $('#closedRequests > .form-group').slideDown(500);
  });
}

$('#updateRequests').submit(function(event) {
  event.preventDefault();
  const submit_button = $(this).find(':submit');
  const spinner = $(this).find('#spinnerUpdateRequests');

  submit_button.hide();
  spinner.show();

  const post_url = $(this).attr("action"); //get form action url
  const request_method = $(this).attr("method"); //get form GET/POST method
  const form_data = $(this).serialize(); //Encode form elements for submission

  $.ajax({
    url : post_url,
    type: request_method,
    data : form_data,
  }).done(function(response) {
    spinner.hide();
    submit_button.show();
    updateRequests();
    return;
  });
});

function sendData(data) {
  const submit_button = $(data).find(':submit');

  const post_url = $(data).attr("action"); //get form action url
  const request_method = $(data).attr("method"); //get form GET/POST method
  const form_data = $(data).serialize(); //Encode form elements for submission

  $.ajax({
    url : post_url,
    type: request_method,
    data : form_data,
  }).done(function(response) {
    return;
  });
}

$('#smsForm').submit(function(event) {
  event.preventDefault();
  sendData('#smsForm');
});

$('#emailForm').submit(function(event) {
  event.preventDefault();
  sendData('#emailForm');
});

function getAge(date) {
  const today = Date.now();
  const age = new Date(today - new Date(date).getTime());
  return Math.abs(age.getUTCFullYear() - 1970);
}

const requestModal = (index, request) => `
  <div class="modal fade" id="requestModal${index}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" data-dismiss="modal" class="close">&times;</button>
          <p id="requestId${index}" style="display: none;">${request['_id']}</p>
          <h4 style="font-weight: bold;">${request.firstName} ${request.lastName}'s request</h4>      
        </div>
        <div class="modal-body">
          <h4>Applied</h4>
          <p>${new Date(request.openedAt).toLocaleString()}</p>
          <h4 style="margin-top: 1em;">Notes</h4>
          <textarea class="form-control" rows="5" id="requestNote${index}" style="resize:none;">${request.note}</textarea>
          <button class="btn btn-primary" style="margin-top: 1em" id="updateNoteBtn${index}" type="button">Save note</button
        </div>
      </div>
    </div>
  </div>
`

const closedRequestModal = (index, request) => `
  <div class="modal fade" id="closedRequestModal${index}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <p id="closedRequestId${index}" style="display: none;">${request['_id']}</p>
          <h3>${request.firstName} ${request.lastName}'s request</h4>
          <h4 style="margin-top: 2em;">Applied</h4>
          <p>${timeago().format(request.openedAt)}</p>
          <h4 style="margin-top: 1em;">Notes</h4>
          <textarea class="form-control" rows="5" id="closedRequestNote${index}">${request.note}</textarea>
          <button class="btn btn-primary" style="margin-top: 1em" id="closedUpdateNoteBtn${index}" type="button">Save note</button>
          <button class="btn btn-secondary pull-right" style="margin-top: 1em" id="reopenClosedReqBtn${index}" type="button">Reopen Request</button>
        </div>
      </div>
    </div>
  </div>
`


function addListenersForUpdateNotes(index) {
  $('#updateNoteBtn'+index).click(() => {
    const data = {
      '_id': $('#requestId'+index).text(),
      'note': $('#requestNote'+index).val()
    }
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/note/add",
      type: 'post',
      data: data,
      success: function(data) {
        $('#requestModal'+index).modal('toggle');
      }
    });
  })
}

function addListenersForClosedRequestModal(index) {
  $('#reopenClosedReqBtn'+index).click(() => {
    $.ajax({
      url: $('#closedRequests').attr('action'),
      type: 'post',
      data: {'_id': $('#closedRequestId'+index).text()},
      success: function(data) {
        updateRequests();
      }
    })
    $('#closedRequestModal'+index).modal('toggle');
  });
  $('#closedUpdateNoteBtn'+index).click(() => {
    const data = {
      '_id': $('#closedRequestId'+index).text(),
      'note': $('#closedRequestNote'+index).val()
    }
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/note/add",
      type: 'post',
      data: data,
      success: function(data) {
        $('#closedRequestModal'+index).modal('toggle');
      }
    });
  })
}

const UpdatePanel = ({ index, name }) => `
  <div class="panel shadow">
    <div class="panel-body">
      <div class="row text-center">
        <div class="col-xs-6 col-sm-2">
          <h4 id="bedtype${index}" style="text-transform: uppercase;">ICON</h4>
        </div>
        <div class="col-xs-6 col-sm-4">
          <h4>${name}</h4>
        </div>
        <div class="col-xs-4 col-sm-2">
          <h6>Available</h6>
          <input type="radio" name="beds[${index}][isOccupied]" value="Available" id='available${index}' />
        </div>
        <div class="col-xs-4 col-sm-2">
          <h6>Pending</h6>
          <input type="radio" name="beds[${index}][isOccupied]" value="Pending" id='pending${index}' />
        </div>
        <div class="col-xs-4 col-sm-2">
          <h6>Occupied</h6>
          <input type="radio" name="beds[${index}][isOccupied]" value="Unavailable" id='unavailable${index}' />
        </div>
      </div>
    </div>
  </div>
`;

const RequestPanel = ({ index, name, email, number, age, id, gender }) => {
  var html = `
    <div class="panel shadow" style='height: 10vh; min-height: 80px;'>
      <div class="panel-body" style="height: 100%;">
      <div class="row text-center" style="height: 100%; display: flex; align-items: center;">
          <div class="col-xs-6 col-sm-2">
            <h4>${gender}</h4>
          </div>
          <div class="col-xs-6 col-sm-2">
            <a href='#' class='addEmail' data-toggle='modal' data-target='#emailmodal' data-email='${email}'>
              <h5>${email}</h5>
            </a>
            `;
  var num = number.substring(0,2);
  if (num !== '04') {
    html += `       <h5>${number}</h5>
            `;
  }
  else {
    html += `        <a href='#' class='addNum' data-toggle='modal' data-target='#smsmodal' data-num='${number}'>
              <h5>${number}</h5>
              </a>
              `;
  }

  html += `      </div>
          <div class="col-xs-6 col-sm-2">
            <h4>${name}</h4>
          </div>
          <div class="col-xs-6 col-sm-1">
              <h6>${age}</h6>
          </div>
          <div class="col-xs-6 col-sm-2">
            <input type="checkbox" name='requests[${index}]' value='${id}' />
          </div>
          <div>
            <a data-toggle="modal" data-target="#requestModal${index}" class="btn btn-primary">Notes</a>
          </div>
        </div>
      </div>
    </div>
  `;
  return html;
};

$(document).on("click", ".addNum", function () {
  var number = $(this).data('num');
  number = '61'+number.substring(1,number.length);
  $(".modal-body #tosms").val( number );
});

$(document).on("click", ".addEmail", function () {
  var email = $(this).data('email');
  $(".modal-body #toemail").val( email );
});

const ClosedRequestPanel = ({ index, name, email, number, age, gender, closedAt }) => {
  var html = `
  <div class="panel shadow" style='height: 10vh; min-height: 80px;'>
    <div class="panel-body" style="height: 100%">
      <div class="row text-center" style="height: 100%; display: flex; align-items: center;">
        <div class="col-xs-6 col-sm-2">
          <h4>${gender}</h4>
        </div>
        <div class="col-xs-6 col-sm-2">
          <a href='#' class='addEmail' data-toggle='modal' data-target='#emailmodal' data-email='${email}'>
            <h5>${email}</h5>
          </a>
          `;
  var num = number.substring(0,2);
  if (num !== '04') {
    html += `       <h5>${number}</h5>
            `;
  }
  else {
    html += `        <a href='#' class='addNum' data-toggle='modal' data-target='#smsmodal' data-num='${number}'>
              <h5>${number}</h5>
              </a>
              `;
  }
  html += `
          </div>
          <div class="col-xs-6 col-sm-2">
            <h4>${name}</h4>
          </div>
          <div class="col-xs-6 col-sm-1">
            <h6>${age}</h6>
          </div>
          <div class="col-xs-6 col-sm-2">
            <h5>${closedAt}</h5>
          </div>
          <div>
            <a data-toggle="modal" data-target="#closedRequestModal${index}" class="btn btn-primary">Notes</a>
          </div>
      </div>
    </div>
  `;
  return html;
};

/**
 *  When the user clicks the Service Profile tab
 */
$('a[href="#serviceProfile"]').on('click', function() {
  $('#addServiceForm').hide();
  $('#spinnerLoadProfile').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/profile', function(data) {
    document.getElementById('addServiceForm').action =  '/service/update/' + data.service.name;

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
      $('#serveAllowTexts').prop('checked', true)
    }
    let $inputs = $('#serveAmenitiesForm :input');

    $inputs.each(function() {
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
  $.get('/service/dashboard/' + $('#uri').text() + '/images', function(data) {
    createImages($('#uri').text(), data.data.logo, data.data.images);

    $('#loadingPhotoUploadRow').fadeOut(400, function() {
      $('#photoUploadRow').slideDown(1000);
    });
  });
});

function createImages(uri, logo, images) {
  if (logo) {
    $('#logoSpace').append(ImagePanel({
      uri,
      image: logo,
      index: -1,
    }));
    $('#logoSpace').children('div[data=image]').show(0);
  } else {
    $('#logoSpace').append(AddImagePanel({
      uri,
      route: '/logo/add',
    }));
    $('#logoSpace').children('div[data=addImage]').show(0);
  }

  let index = 0;
  if (!images || images.length < 6) {
    $('#photoSpace').append(AddImagePanel({
      uri,
      route: '/add',
    }));
    $('#photoSpace').children('div[data=addImage]').show(0);
  }
  if (images) {
    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      $('#photoSpace').append(ImagePanel({
        uri,
        image,
        index: index++,
      }));
    }
    $('#photoSpace').children('div[data=image]').each(function() {
      $(this).show(0);
    });
  }
}

/**
 *  Uploading logo image
 **/
$('#logoSpace').on('change', 'input:file', function(event) {
  console.log('logo add');
  event.preventDefault();

  const $plus = $(this).prevAll('#plus-img');
  const $spinner = $(this).prevAll('#spinner-gif');
  console.log($spinner);
  const $element = $(this);

  $plus.hide();
  $spinner.show();
  $('#alertBox').hide('slide');

  toggleInputs();

  // Get the uploaded file from the form and store it in a FormData object
  const uploadedFile = $(this).prop("files")[0];
  const formData = new FormData();
  formData.append('file', uploadedFile, uploadedFile.name);

  // Upload the FormData object to the server in a POST request
  $.ajax({
    url: "/service/profile/" + $('#uri').text() + "/logo/add",
    type: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data) {
      if (!data.error) {
        toggleInputs();

        $element.closest('div[data=addImage]').hide(500, function() {
          $(this).remove();
        });

        $('#logoSpace').append(ImagePanel({
          uri,
          image: data.mediaLink,
          index: '-logo',
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
    error: function(jqXHR, textStatus, errorThrown) {
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
})

$('#logoSpace').on('click', '[id^=deleteimagebutton-image]', function(event) {
  event.preventDefault();

  const $element = $(this);

  toggleInputs();

  let url = '/service/profile/' + $('#uri').text() + '/logo/delete';
  $.post(url, function(data) {
    if (!data.error) {

      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');

      toggleInputs();

      $('#logoSpace').prepend(AddImagePanel({
        uri : $('#uri').text(),
        route: '/logo/add',
      }));
      $('#logoSpace').children('div[data=addImage]').show(500);

      $element.closest('div[id^=deleteimagemodal-image]').on('hidden.bs.modal', function() {
        $(this).closest('div[data=image]').hide(500, function() {
          $(this).remove();
        });
      });

    } else {
      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
      response = xhr.responseText ? JSON.parse(xhr.responseText) : JSON.parse(xhr.responseXML);
      $('#alertBox').html("<strong>Error! </strong>" + response.message).show('slide');
      toggleInputs();
    }
  }).fail(function(xhr, status, error) {
    $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
    response = JSON.parse(xhr.responseText);
    $('#alertBox').html("<strong>Failure! </strong>" + response.message).show('slide');
    toggleInputs();
  });
})

/**
 *  Uploading normal image
 **/
$('#photoSpace').on('change', 'input:file', function(event) {
  console.log('image add');
  event.preventDefault();

  const uploadedFile = $(this).prop("files")[0];

  if(uploadedFile) {

    const $plus = $(this).prevAll('#plus-img');
    const $spinner = $(this).prevAll('#spinner-gif');
    const $element = $(this);

    $plus.hide();
    $spinner.show();
    $('#alertBox').hide('slide');

    toggleInputs();

    // Get the uploaded file from the form and store it in a FormData object
    const uploadedFile = $(this).prop("files")[0];
    const formData = new FormData();
    formData.append('file', uploadedFile, uploadedFile.name);

    // Upload the FormData object to the server in a POST request
    $.ajax({
      url: "/service/profile/" + $('#uri').text() + "/add",
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        if (!data.error) {
          // File upload successful - change the images mediaLink to the thumbnail and modal
          toggleInputs();

          let photoCount = $('#photoSpace').find('div[data=image]').length;

          console.log(photoCount);

          $('#photoSpace').append(ImagePanel({
            uri,
            image: data.mediaLink,
            index: photoCount++,
          }));
          $('#photoSpace').children('div[data=image]').last().show(500);

          console.log(photoCount);

          // Enable the images and hide the spinner, then toggle the inputs
          if (photoCount < 6) {
            $plus.show();
            $spinner.hide();
          } else {
            $element.closest('div[data=addImage]').hide(500, function() {
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
      error: function(jqXHR, textStatus, errorThrown) {
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
})

$('#photoSpace').on('click', '[id^=deleteimagebutton-image]', function(event) {
  event.preventDefault();

  const $element = $(this);

  const index = $('#photoSpace').find('div[data=image]').index($element.closest('div[data=image]'));
  const count = $('#photoSpace').find('div[data=image]').length;

  console.log(count);

  toggleInputs();

  let url = '/service/profile/' + $('#uri').text() + '/' + index + '/delete';
  $.post(url, function(data) {
    if (!data.error) {

      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');

      toggleInputs();

      if (count == 6) {
        $('#photoSpace').prepend(AddImagePanel({
          uri : $('#uri').text(),
          route: '/add',
        }));
        $('#photoSpace').children('div[data=addImage]').show(500);
      }

      $element.closest('div[id^=deleteimagemodal-image]').on('hidden.bs.modal', function() {
        $(this).closest('div[data=image]').hide(500, function() {
          $(this).remove();
        });
      });

    } else {
      $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
      response = xhr.responseText ? JSON.parse(xhr.responseText) : JSON.parse(xhr.responseXML);
      $('#alertBox').html("<strong>Error! </strong>" + response.message).show('slide');
      toggleInputs();
    }
  }).fail(function(xhr, status, error) {
    $element.closest('div[id^=deleteimagemodal-image]').modal('hide');
    response = JSON.parse(xhr.responseText);
    $('#alertBox').html("<strong>Failure! </strong>" + response.message).show('slide');
    toggleInputs();
  });
})

/**
 *  Toggles the inputs for the page, including the image and logo uploading buttons,
 *  and the deletion buttons on each of the image modals
 */
function toggleInputs() {
  $('#photoUploadRow').find('input:file').each(function() {
    $(this).prop('disabled', function(i, v) { return !v; });
  });
  $('#photoUploadRow').find('a[id^=deleteimagebutton]').each(function() {
    $(this).prop('disabled', function(i, v) { return !v; });
    $(this).toggleClass('disabled');
  });
}

$('#photoUploadRow').on('click', 'a[id^=imagethumbnailmodal]', function() {
  console.log('open modal');
  event.preventDefault();
  $(this).closest('div[data=image]').children('div[id^=deleteimagemodal-image]').modal('show');
})

const ImagePanel = ({ uri, image, index }) => `
  <div class="col-sm-2 col-xs-6" data='image' style='display: none;'>
    <div class='modal fade' id='deleteimagemodal-image${index}' role='dialog'>
      <div class='modal-dialog modal-sm'>
        <div class='modal-content'>
          <div class='modal-header'>
            <button class='close' type='button' data-dismiss='modal'>&times;</button>
            <h3>Delete this image?</h3>
            <div class='text-center'>
              <div class='image'>
                <img class='img img-responsive' id='deleteImg${index}' src='${image}' />
              </div>
            </div>
          </div>
          <div class='modal-body text-center'>
            <a class='btn btn-danger btn-lg' id='deleteimagebutton-image${index}'>
              Delete
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class='thumbnail'>
      <div class='image highlight'>
        <a href='#' id='imagethumbnailmodal${index}' >
          <img class='img-responsive' src='${image}'/>
        </a>
      </div>
    </div>
  </div>
`;

const AddImagePanel = ({ uri, route }) => `
  <div class="col-sm-2 col-xs-6" data="addImage" style="display: none;">
    <form action='/service/profile/${uri}${route}' method='post' enctype='multipart/form-data'>
      <div class='thumbnail' style='line-height: 0px;'>
        <div class='image highlight'>
          <label style="margin: 0px;">
            <img class='img-responsive' id='plus-img' src='/images/plus.png' alt='Add Image' style='cursor: pointer;'/>
            <img class='img-responsive' id='spinner-gif' src='/images/loading_spinner.gif' style='display: none;'/>
            <input type='file' accept='image/*' hidden='' name='fileAdd' />
          </label>
        </div>
      </div>
    </form>
  </div>
`;

/**
 *  When the user clicks the Beds Available tab
 */
function fetchBedsAvailable() {
  $.get('/service/beds/available', function(services) {
    $('#spinnerBedsAvailable').hide();
    for (var i = 0; i < services.crisis.length; i++) {
      var service = services.crisis[i];
      $('#crisis-table').append(`
      <tr class="table-panel">
        <td>${service.serviceName}</td>
        <td>${service.numBeds}</td>
        <td>${service.numMale}</td>
        <td>${service.numFemale}</td>
        <td>${service.numEither}</td>
        <td>${service.phoneNumber}</td>
      </tr>
      `)
    }

    for (var i = 0; i < services.transitional.length; i++) {
      var service = services.transitional[i];
      $('#transitional-table').append(`
        <tr class="table-panel">
          <td>${service.serviceName}</td>
          <td>${service.phoneNumber}</td>
        </tr>
      `)
    }
	})
}

$('#serveAmenitiesForm :input').click(function() {
  const id = $(this).attr('id');
  const checkedState = document.getElementById(id).checked;
  const data = {
    checkedState,
    id
  }
  $.ajax({
    url: '/service/amenities/' + $('#uri').text() + '/update',
    method: 'POST',
    data,
    success: function(data) {

    }
  })
})

/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v3.0.2
 * https://github.com/hustcc/timeago.js
**/
/* jshint expr: true */
!function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root); // nodejs support
    module.exports['default'] = module.exports; // es6 support
  }
  else
    root.timeago = factory(root);
}(typeof window !== 'undefined' ? window : this,
function () {
  var indexMapEn = 'second_minute_hour_day_week_month_year'.split('_'),
    indexMapZh = '秒_分钟_小时_天_周_月_年'.split('_'),
    // build-in locales: en & zh_CN
    locales = {
      'en': function(number, index) {
        if (index === 0) return ['just now', 'right now'];
        var unit = indexMapEn[parseInt(index / 2)];
        if (number > 1) unit += 's';
        return [number + ' ' + unit + ' ago', 'in ' + number + ' ' + unit];
      },
      'zh_CN': function(number, index) {
        if (index === 0) return ['刚刚', '片刻后'];
        var unit = indexMapZh[parseInt(index / 2)];
        return [number + unit + '前', number + unit + '后'];
      }
    },
    // second, minute, hour, day, week, month, year(365 days)
    SEC_ARRAY = [60, 60, 24, 7, 365/7/12, 12],
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
      .replace(/-/, '/').replace(/-/, '/')
      .replace(/(\d)T(\d)/, '$1 $2').replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
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
    locale = locales[locale] ? locale : (locales[defaultLocale] ? defaultLocale : 'en');
    // if (! locales[locale]) locale = defaultLocale;
    var i = 0,
      agoin = diff < 0 ? 1 : 0, // timein or timeago
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
    var rst = 1, i = 0, d = Math.abs(diff);
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
    if(node.getAttribute) return node.getAttribute(name); // native
    if(node.attr) return node.attr(name); // jquery
  }
  // set the node attribute, native DOM and jquery supported.
  function setTidAttr(node, val) {
    if(node.setAttribute) return node.setAttribute(ATTR_DATA_TID, val); // native
    if(node.attr) return node.attr(ATTR_DATA_TID, val); // jquery
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
  Timeago.prototype.doRender = function(node, date, locale) {
    var diff = diffSec(date, this.nowDate),
      self = this,
      tid;
    // delete previously assigned timeout's id to node
    node.innerHTML = formatDiff(diff, locale, this.defaultLocale);
    // waiting %s seconds, do the next render
    timers[tid = setTimeout(function() {
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
  Timeago.prototype.format = function(date, locale) {
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
  Timeago.prototype.render = function(nodes, locale) {
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
  Timeago.prototype.setLocale = function(locale) {
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
  timeagoFactory.register = function(locale, localeFunc) {
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
  timeagoFactory.cancel = function(node) {
    var tid;
    // assigning in if statement to save space
    if (node) {
      tid = getAttr(node, ATTR_DATA_TID); // get the timer of DOM node(native / jq).
      if (tid) {
        clearTimeout(tid);
        delete timers[tid];
      }
    } else {
      for (tid in timers) clearTimeout(tid);
      timers = {};
    }
  };

  return timeagoFactory;
});
