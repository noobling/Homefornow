/**
 * Checks if the #addReview form has data for all 
 * fields if it doesn't then an error message is shown
 * to the user and the form does not submit to the server
 */
$('#addReview').submit(function (e) {
	$('.alert.alert-danger').hide();
	if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
		}
		return false;
	}
});

