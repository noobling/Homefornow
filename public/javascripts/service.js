var bedIndex = 0;

$('#editBedModal').on('show.bs.modal', function() {
  $('#spinnerAddBeds').show();
  $('#bedList').hide();
  $.ajax({
    url: '/service/dashboard/' + $('#uri').text() + '/beds',
    method: 'GET',
    success: function(data) {
      for (bed of data.service.beds) {
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

$('#removeBed').click(function() {
  $('#bedList').children().last().remove();
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
    spinner.hide(100);
    submit_button.show(100);
    $('#editBedModal').modal('hide');
    updateBeds();
    return;
  });
})

const BedPanel = ({ index, name }) => `
  <div class="panel shadow">
    <div class="panel-body">
      <div class="row text-center">
        <div class="col-xs-4">
          <input type="text" name="beds[${index}][name]" id="bedName${index}" value="${name}" required placeholder="Bed Name" class="form-control"/>
        </div>
        <div class="col-xs-4">
          <select name="beds[${index}][gender]" id="bedGender${index}" required class="form-control">
            <option hidden='true'>Gender</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Either'>Either</option>
          </select>
        </div>
        <div class="col-xs-4">
          <select name="beds[${index}][bedType]" id="bedType${index}" required class="form-control">
            <option hidden='true'>Bed Type</option>
            <option value='Single'>Single</option>
            <option value='ParentChild'>Parent with Child</option>
          </select>
        </div>
      </div>
    </div>
  </div>
`;

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

/**
 *  TODO: COMMENT
 */
$(document).ready(function() {
  updateBeds();

  updateRequests();
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
  $.get('/service/dashboard/' + $('#uri').text() + '/beds', function(data) {
    let index = 0;
    for (bed of data.service.beds) {
      $('#updateBeds > .form-group').append(UpdatePanel({
        index,
        name: bed.name
      }));
      $('#avaliable'+index).prop('checked', bed.isOccupied === 'Available');
      $('#pending'+index).prop('checked', bed.isOccupied === 'Pending');
      $('#unavailable'+index).prop('checked', bed.isOccupied === 'Unavailable');
      index++;
    }
    $('#spinnerLoadBeds').hide();
    $('#updateBeds > .form-group').slideDown(500);
  });
}

function updateRequests() {
  $('#requestList').html('');
  $('#requestList').hide();
  $('#spinnerLoadRequests').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/requests', function(data) {
    for (request of data.requests) {
      $('#requestList').append(RequestPanel({
        index: 0,
        name: request.firstName + ' ' + request.lastName,
        email: request.email,
        number: request.phoneNumber,
        age: getAge(request.dob),
      }));
    }
    $('#spinnerLoadRequests').hide();
    $('#requestList').slideDown(500);
  });
}

function getAge(date) {
  const today = Date.now();
  const age = new Date(today - new Date(date).getTime());
  return Math.abs(age.getUTCFullYear() - 1970);
}

const UpdatePanel = ({ index, name }) => `
  <div class="panel shadow">
    <div class="panel-body">
      <div class="row text-center">
        <div class="col-xs-2">
          <h4>ICON</h4>
        </div>
        <div class="col-xs-4">
          <h4>${name}</h4>
        </div>
        <div class="col-xs-2">
          <h6>Avaliable</h6>
          <input type="radio" name="beds[${index}][isOccupied]" value="Available" id='avaliable${index}' />
        </div>
        <div class="col-xs-2">
          <h6>Pending</h6>
          <input type="radio" name="beds[${index}][isOccupied]" value="Pending" id='pending${index}' />
        </div>
        <div class="col-xs-2">
          <h6>Occupied</h6>
          <input type="radio" name="beds[${index}][isOccupied]" value="Unavailable" id='unavailable${index}' />
        </div>
      </div>
    </div>
  </div>
`;

const RequestPanel = ({ index, name, email, number, age }) => `
  <div class="panel shadow">
    <div class="panel-body">
      <div class="row text-center">
        <div class="col-xs-2">
          <h4>ICON</h4>
        </div>
        <div class="col-xs-3">
          <h6>${email}</h6>
          <h6>${number}</h6>
        </div>
        <div class="col-xs-3">
          <h4>${name}</h4>
        </div>
        <div class="col-xs-2">
          <h6>${age}</h6>
        </div>
        <div class="col-xs-2">
          <input type="checkbox"/>
        </div>
      </div>
    </div>
  </div>
`;

/**
 *  When the user clicks the Service Profile tab
 */
$('a[href="#serviceProfile"]').on('click', function() {
  $('#addServiceForm').hide();
  $('#spinnerLoadProfile').show();
  $.get('/service/dashboard/' + $('#uri').text() + '/profile', function(data) {

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

    let $inputs = $('#serveAmenitiesForm :input');

    $inputs.each(function() {
      for (amen of data.service.amenities) {
        if (amen.name === this.id) {
          $(this).prop('checked', true);
        }
      }
    });
    $('#spinnerLoadProfile').hide();
    $('#addServiceForm').slideDown(1000);
  });
});

/**
 *  When the user clicks the Beds Available tab
 */
$('a[href="#bedsAvaliable"]').on('click', function() {
  console.log('What a meme');
});
