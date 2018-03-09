/**
 * Checks if the #addReview form has data for all 
 * fields if it doesn't then an error message is shown
 * to the user and the form does not submit to the server
 */
$('#addReview').submit((e) => {
	$('.alert.alert-danger').hide();
	if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend("<div role='alert' class='alert alert-danger'>All fields required, please try again</div>");
		}
		return false;
	}
});

/**
 * Validation of the password input field in the Register Modal
 * Displays the strength of password in a span and
 * removes disabled from the confirm password input field when the strength is strong
 */
$('#Rpwd').keyup( function() {
	const password = $(this).val();
	
	//TextBox left blank.
	if (password.length == 0) 
	{
			$('#passstrength').html('');
			return;
	}

	//Regular Expressions.
	let regex = new Array();
	regex.push('[A-Z]'); //Uppercase Alphabet.
	regex.push('[a-z]'); //Lowercase Alphabet.
	regex.push('[0-9]'); //Digit.
	regex.push('[$@$!%*#?&]'); //Special Character.
	let passed = 0;

	//Validate for each Regular Expression.
	for (var i = 0; i < regex.length-1; i++) 
	{
			if (new RegExp(regex[i]).test($(this).val())) 
			passed++;
	}

	validate(false);

	//Validate for length of Password.
	if (passed > 2 && $(this).val().length >= 8)
	{
			passed++;
			$('#Cpwd').prop('disabled', false);
			validate(true);
	}
	else
			$('#Cpwd').prop('disabled', true);

	if (new RegExp(regex[regex.length-1]).test($(this).val())) 
			passed++;

	//Display status.
	let color = '';
	let strength = '';
	switch (passed) 
	{
			case 0:
			case 1:
			case 2:
							strength = 'Very Weak';
							color = 'red';
							break;
			case 3:
							strength = 'Weak';
							color = 'darkorange';
							break;
			case 4:
							strength = 'Strong';
							color = 'green';
							break;
			case 5:
							strength = 'Very Strong';
							color = 'darkgreen';
							break;
	}
	$('#passstrength').html(strength);
	$('#passstrength').css('color', color);
});

/**
 * Checks if confirm password is the same as the password of the user in Register Modal
 */
$('#Cpwd').keyup( function() {
	let confirm = $(this).val();
	let pass = $('#Rpwd').val();

	validate(false);

	if($('#con').not("has-feedback"))
	{
			$('#con').addClass("has-feedback");
			$('#CPfeed').addClass("glyphicon form-control-feedback");
	}

	if(confirm != pass)
	{
			if($('#con').not("has-error"))
			{
					$('#con').addClass("has-error");
					$('#CPfeed').addClass("glyphicon-remove");
			}
	}
	else
	{
			$('#con').removeClass("has-error");
			$('#CPfeed').removeClass("glyphicon-remove");

			$('#con').addClass("has-success");
			$('#CPfeed').addClass("glyphicon-ok");

			validate(true);
	}
});

/**
 * Validation of the user's first name input in the Register Modal
 * uses RegEx for validation
 */
$('#fName').on('change keyup', function() {
	let first = $(this).val();
	const nameReg = /^\b(?![\s]+$)[a-zA-Z'\s-]+\b$/;	

	validate(false);
	
	if($('#first').not("has-feedback"))
	{
			$('#first').addClass("has-feedback");
			$('#FNfeed').addClass("glyphicon form-control-feedback");
	}

	if(nameReg.test(first))
	{
			if($('#first').not("has-success"))
			{
					$('#first').removeClass("has-error");
					$('#FNfeed').removeClass("glyphicon-remove");

					$('#first').addClass("has-success");
					$('#FNfeed').addClass("glyphicon-ok");

					validate(true);
			}
	}
	else
	{
			$('#first').removeClass("has-success");
			$('#FNfeed').removeClass("glyphicon-ok");
			
			$('#first').addClass("has-error");
			$('#FNfeed').addClass("glyphicon-remove");            
	}
});

/**
 * Validation of the user's last name input in the Register Modal
 * uses RegEx for validation
 */
$('#lName').on('change keyup', function() {
	let last = $(this).val();
	const nameReg = /^\b(?![\s]+$)[a-zA-Z'\s-]+\b$/;

	validate(false);

	if($('#last').not("has-feedback"))
	{
			$('#last').addClass("has-feedback");
			$('#LNfeed').addClass("glyphicon form-control-feedback");
	}

	if(nameReg.test(last))
	{
			if($('#last').not("has-success"))
			{
					$('#last').removeClass("has-error");
					$('#LNfeed').removeClass("glyphicon-remove");

					$('#last').addClass("has-success");
					$('#LNfeed').addClass("glyphicon-ok");

					validate(true);
			}
	}
	else
	{
			$('#last').removeClass("has-success");
			$('#LNfeed').removeClass("glyphicon-ok");
			
			$('#last').addClass("has-error");
			$('#LNfeed').addClass("glyphicon-remove");            
	}
});

/**
 * Validation of the user's email input in the Register Modal
 * uses RegEx for validation
 */
$('#email').on('change keyup', function() {
	const email = $(this).val();
	const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

	validate(false);

	if($('#Email').not("has-feedback"))
	{
			$('#Email').addClass("has-feedback");
			$('#Efeed').addClass("glyphicon form-control-feedback");
	}

	if(!emailReg.test(email))
	{
			if($('#Email').not("has-error"))
			{
					$('#Email').addClass("has-error");
					$('#Efeed').addClass("glyphicon-remove");
			}
	}
	else
	{
			$('#Email').removeClass("has-error");
			$('#Efeed').removeClass("glyphicon-remove");

			$('#Email').addClass("has-success");
			$('#Efeed').addClass("glyphicon-ok");

			validate(true);
	}
});

/**
 * Validation of the user's phone number input in the Register Modal
 * uses RegEx for validation
 */
$('#phone').on('change keyup', function() {
	const phone = $(this).val();
	const numReg = /^[0-9]+$/;

	if(numReg.test(phone) && phone.length == 10)
	{
			if($('#Phone').not("has-success"))
			{
					$('#Phone').removeClass("has-error");
					$('#Pfeed').removeClass("glyphicon-remove");
					
					$('#Phone').addClass("has-success");
					$('#Pfeed').addClass("glyphicon-ok");

					validate(true);
			}
	}
	else if(phone.length == 0)
	{
			$('#Phone').removeClass("has-success");
			$('#Pfeed').removeClass("glyphicon-ok");

			$('#Phone').removeClass("has-error");
			$('#Pfeed').removeClass("glyphicon-remove");

			validate(true);
	}
	else
	{
			$('#Phone').addClass("has-error has-feedback");
			$('#Pfeed').addClass("glyphicon glyphicon-remove form-control-feedback");
			
			$('#Phone').removeClass("has-success");
			$('#Pfeed').removeClass("glyphicon-ok");  
			
			validate(false);
	}
});

/**
 * Validation of the user's gender in the Register Modal
 * uses RegEx for validation
 */
$('#gender').change(function() {
	validate(true);
})

/**
 * Check for a change in the dropdown menus for DOB and validates them
 */
$('#day, #month, #year').change(dateValid);

/**
 * Validation of the user's DOB in the Register Modal
 * uses RegEx for validation and returns it's boolean value
 */
function dateReg()
{
	var datReg = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;

	const dd = $('#day').val();
	const mm = Number($('#month').val())+1;
	const yy = $('#year').val();

	const dob = dd+'/'+mm+'/'+yy;

	return datReg.test(dob);
}

/**
 * Validation of the user's DOB in the Register Modal
 * front end for it
 */
function dateValid()
{
	const dd = $('#day').val();
	const mm = Number($('#month').val())+1;
	const yy = $('#year').val();

	const dob = dd+'/'+mm+'/'+yy;

	if(dob == '/1/') {}
	else if(dateReg())
	{
			if($('#dob').not("has-success"))
			{
					$('#dob').removeClass("has-error");
					$('#dob').addClass("has-success");

					validate(true);
			}
	}
	else
	{
			$('#dob').removeClass("has-success");
			$('#dob').addClass("has-error");     
			
			validate(false);
	}	
}

/**
 * Validation of the Register Modal
 * If the validation checks out, 
 * removes the disabled field from the submit button
 */
function validate(bool)
{
	const fname = $('#fName').val().length;
	const lname = $('#lName').val().length;
	const gen = $('#gender').val().length;
	const email = $('#email').val().length;
	const pass = $('#Rpwd').val();
	const con = $('#Cpwd').val();

	const dob = dateReg();

	if (fname > 0 && lname > 0 && email > 0 && pass.length > 0 && con == pass && dob && gen > 0 && bool)
		$('#Reg').prop('disabled', false);
	else
		$('#Reg').prop('disabled', true);
}

/**
 * Validation of the user's email input in the Login Modal
 * uses RegEx for validation
 */
$('#Lemail').on('change keyup', function() {
	const email = $(this).val();
	const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

	validLogin(false);

	if($('#Login_email').not("has-feedback"))
	{
			$('#Login_email').addClass("has-feedback");
			$('#Login_EFeed').addClass("glyphicon form-control-feedback");
	}

	if(!emailReg.test(email))
	{
			if($('#Login_email').not("has-error"))
			{
					$('#Login_email').addClass("has-error");
					$('#Login_EFeed').addClass("glyphicon-remove");
			}
	}
	else
	{
			$('#Login_email').removeClass("has-error");
			$('#Login_EFeed').removeClass("glyphicon-remove");

			$('#Login_email').addClass("has-success");
			$('#Login_EFeed').addClass("glyphicon-ok");

			validLogin(true);
	}
});

/**
 * Checks if confirm password is the same as the password of the user in Register Modal
 */
$('#pwd').keyup( function() {
	const pass = $(this).val();

	let regex = new Array();
	regex.push('[A-Z]'); //Uppercase Alphabet.
	regex.push('[a-z]'); //Lowercase Alphabet.
	regex.push('[0-9]'); //Digit.
	regex.push('[$@$!%*#?&]'); //Special Character.
	let passed = 0;

	//Validate for each Regular Expression.
	for (var i = 0; i < regex.length; i++) 
	{
			if (new RegExp(regex[i]).test(pass))
			passed++;
	}

	if($('#Login_pass').not("has-feedback"))
	{
			$('#Login_pass').addClass("has-feedback");
			$('#Login_PFeed').addClass("glyphicon form-control-feedback");
	}

	validLogin(false);

	//Validate for length of Password.
	if(passed < 3 || pass.length < 8)
	{
			passed++;
			if($('#Login_pass').not("has-error"))
			{
					$('#Login_pass').addClass("has-error");
					$('#Login_PFeed').addClass("glyphicon-remove");
			}
	}
	else
	{
			$('#Login_pass').removeClass("has-error");
			$('#Login_PFeed').removeClass("glyphicon-remove");

			$('#Login_pass').addClass("has-success");
			$('#Login_PFeed').addClass("glyphicon-ok");

			validLogin(true);
	}
});

function validLogin(bool)
{
		const email = $('#Lemail').val().length;
		const pass = $('#pwd').val().length;

		if (email > 0 && pass > 0 && bool)
			$('#Login').prop('disabled', false);
		else
			$('#Login').prop('disabled', true);
}