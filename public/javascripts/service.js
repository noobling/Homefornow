var bedIndex = 0;

$('#editBedModal').on('show.bs.modal', function() {
  console.log('hello world');
  $.ajax({
    url: '/service/beds',
    method: 'GET',
    success: function(data) {
      console.log('success');
      console.log(data);
      for (bed of data) {
        $('#bedList').append(BedPanel({
          index: bedIndex,
          name: bed.name,
        }));
        $('#bedGender'.concat(bedIndex)).val(bed.gender);
        $('#bedType'.concat(bedIndex)).val(bed.bedType);
        bedIndex++;
      }
    },
  });
});

$('#editBedModal').on('hidden.bs.modal', function() {
  console.log('goodbye world');
  $('#bedList').html('');
  bedIndex = 0;
})

$('#addBed').click(function() {
  $('#bedList').append(BedPanel({ index: bedIndex++, name: "" }));
})

$('#removeBed').click(function() {
  console.log('remove');
  // $(this).parent().parent().parent().remove();
  $('#bedList').children().last().remove();
})

// $('#bedForm').submit(function( event ) {
//   console.log('caught');
//
//   event.preventDefault();
// })

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
  const spinner = $(this).find('#spinnerLogo-gif');
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
    return;
  });
})

/**
 *  TODO: COMMENT
 */
$(document).ready(function() {
  // AJAX for first tab
});

/**
 *  When the user clicks the Bed Management tab
 */
$('a[href="#bedManagement"]').on('click', function() {
  console.log('What a meme');
});

/**
 *  When the user clicks the Service Profile tab
 */
$('a[href="#serviceProfile"]').on('click', function() {
  console.log('What a meme');
});

/**
 *  When the user clicks the Beds Available tab
 */
$('a[href="#bedsAvaliable"]').on('click', function() {
  console.log('What a meme');
});
