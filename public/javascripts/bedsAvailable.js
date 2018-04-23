$('a[href="#bedsAvailable"]').click(function() {
	$('#spinnerLoadProfile').show();
	$.get('/bes/available', function(data) {
		$('#spinnerLoadProfile').hide();
	})
})