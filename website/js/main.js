"use strict"
const serverUrl = "http://127.0.0.1:8000";

(function () {
	//Login/Signup modal window - by CodyHouse.co
	function ModalSignin(element) {
		this.element = element;
		this.blocks = this.element.getElementsByClassName('js-signin-modal-block');
		this.switchers = this.element.getElementsByClassName('js-signin-modal-switcher')[0].getElementsByTagName('a');
		this.triggers = document.getElementsByClassName('js-signin-modal-trigger');
		this.hidePassword = this.element.getElementsByClassName('js-hide-password');
		this.init();
	};

	ModalSignin.prototype.init = function () {
		var self = this;
		//open modal/switch form
		for (var i = 0; i < this.triggers.length; i++) {
			(function (i) {
				self.triggers[i].addEventListener('click', function (event) {
					if (event.target.hasAttribute('data-signin')) {
						event.preventDefault();
						self.showSigninForm(event.target.getAttribute('data-signin'));
					}
				});
			})(i);
		}

		//close modal
		this.element.addEventListener('click', function (event) {
			if (hasClass(event.target, 'js-signin-modal') || hasClass(event.target, 'js-close')) {
				event.preventDefault();
				removeClass(self.element, 'cd-signin-modal--is-visible');
			}
		});
		//close modal when clicking the esc keyboard button
		document.addEventListener('keydown', function (event) {
			(event.which == '27') && removeClass(self.element, 'cd-signin-modal--is-visible');
		});

		//hide/show password
		for (var i = 0; i < this.hidePassword.length; i++) {
			(function (i) {
				self.hidePassword[i].addEventListener('click', function (event) {
					self.togglePassword(self.hidePassword[i]);
				});
			})(i);
		}

		//IMPORTANT - REMOVE THIS - it's just to show/hide error messages in the demo
		this.blocks[0].getElementsByTagName('form')[0].addEventListener('submit', function (event) {
			event.preventDefault();
			self.toggleError(document.getElementById('signin-email'), true);
		});
		this.blocks[1].getElementsByTagName('form')[0].addEventListener('submit', function (event) {
			event.preventDefault();
			self.toggleError(document.getElementById('signup-username'), true);
		});
	};

	ModalSignin.prototype.togglePassword = function (target) {
		var password = target.previousElementSibling;
		('password' == password.getAttribute('type')) ? password.setAttribute('type', 'text') : password.setAttribute('type', 'password');
		target.textContent = ('Hide' == target.textContent) ? 'Show' : 'Hide';
		putCursorAtEnd(password);
	}

	ModalSignin.prototype.showSigninForm = function (type) {
		// show modal if not visible
		!hasClass(this.element, 'cd-signin-modal--is-visible') && addClass(this.element, 'cd-signin-modal--is-visible');
		// show selected form
		for (var i = 0; i < this.blocks.length; i++) {
			this.blocks[i].getAttribute('data-type') == type ? addClass(this.blocks[i], 'cd-signin-modal__block--is-selected') : removeClass(this.blocks[i], 'cd-signin-modal__block--is-selected');
		}
		//update switcher appearance
		var switcherType = (type == 'signup') ? 'signup' : 'login';
		for (var i = 0; i < this.switchers.length; i++) {
			this.switchers[i].getAttribute('data-type') == switcherType ? addClass(this.switchers[i], 'cd-selected') : removeClass(this.switchers[i], 'cd-selected');
		}
	};

	ModalSignin.prototype.toggleError = function (input, bool) {
		// used to show error messages in the form
		toggleClass(input, 'cd-signin-modal__input--has-error', bool);
		toggleClass(input.nextElementSibling, 'cd-signin-modal__error--is-visible', bool);
	}

	var signinModal = document.getElementsByClassName("js-signin-modal")[0];
	if (signinModal) {
		new ModalSignin(signinModal);
	}

	// toggle main navigation on mobile
	var mainNav = document.getElementsByClassName('js-main-nav')[0];
	if (mainNav) {
		mainNav.addEventListener('click', function (event) {
			if (hasClass(event.target, 'js-main-nav')) {
				var navList = mainNav.getElementsByTagName('ul')[0];
				toggleClass(navList, 'cd-main-nav__list--is-visible', !hasClass(navList, 'cd-main-nav__list--is-visible'));
			}
		});
	}

	//class manipulations - needed if classList is not supported
	function hasClass(el, className) {
		if (el.classList) return el.classList.contains(className);
		else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}
	function addClass(el, className) {
		var classList = className.split(' ');
		if (el.classList) el.classList.add(classList[0]);
		else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
		if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
	}
	function removeClass(el, className) {
		var classList = className.split(' ');
		if (el.classList) el.classList.remove(classList[0]);
		else if (hasClass(el, classList[0])) {
			var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
			el.className = el.className.replace(reg, ' ');
		}
		if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
	}
	function toggleClass(el, className, bool) {
		if (bool) addClass(el, className);
		else removeClass(el, className);
	}

	//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
	function putCursorAtEnd(el) {
		if (el.setSelectionRange) {
			var len = el.value.length * 2;
			el.focus();
			el.setSelectionRange(len, len);
		} else {
			el.value = el.value;
		}
	};
})();

var preloader = document.querySelector("#preloader");

// function to show the loader
function showLoader() {
	preloader.style.display = "block";
}

// function to hide the loader
function hideLoader() {
	preloader.style.display = "none";
}

// Signup functionality to register user
function signUp() {
	showLoader(); // show the loader
	const email = document.getElementById('signup-email').value;
	const password = document.getElementById('myInput1').value;
	const confpass = document.getElementById('myInput2').value;
	const name = document.getElementById('signup-username').value;
	const phoneNo = document.getElementById('signup-phoneNo').value;
	const streetAddress = document.getElementById('signup-address').value;
	const city = document.getElementById('signup-city').value;
	const postalCode = document.getElementById('signup-postalcode').value;
	const province = document.getElementById('signup-province').value;

	const body = {
		"email": email,
		"password": password,
		"confirm_password": confpass,
		"name": name,
		"phoneNo": phoneNo,
		"streetAddress": streetAddress,
		"city": city,
		"postalCode": postalCode,
		"province": province
	}
	return fetch(serverUrl + "/signUp", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new HttpError(response);
		}
	}).then(data => {
		hideLoader(); // hide the loader
		if (data['statusCode'] == 409) {
			alert(data['body'])
		}
		else if (data['statusCode'] == 400) {
			alert(data['body'])
		}
		else if (data['statusCode'] == 200) {
			location.href = "./index.html";
		}
	});
}

function isChecked() {
	const rememberMe = document.getElementById('remember-me');
	if (rememberMe.checked) {
		rememberMe.checked = true;
	}
	else {
		rememberMe.checked = false;
	}

}

var LEADID = '';
var USERID = '';
var SELECTED_USERID = '';

// Login functionality for a user
async function signIn() {
	showLoader() // show the loader
	const email = document.getElementById('signin-email').value;
	const password = document.getElementById('signin-password').value;
	const rememberMe = document.getElementById('remember-me').checked;
	const body = {
		"email": email,
		"password": password,
		"remember_me": rememberMe
	}
	fetch(serverUrl + "/logIn", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new HttpError(response);
		}
	}).then(data => {
		hideLoader(); // hide the loader
		if (data['statusCode'] == 401) {
			alert(data['body'])
		}
		else if (data['statusCode'] == 200) {
			USERID = data['body']
			console.log(USERID)
			location.href = "./home.html" + '?user-id=' + USERID;
		}
	}).catch(error => {
		hideLoader(); // hide the loader
		alert("Error: " + error);
	});
}

// Add lead in dynamo db
async function addLead(event) {
	event.preventDefault();
	showLoader() // show the loader
	const body = {
		"userId": USERID,
		"Name": document.getElementById("username").value || '',
		"CompanyName": document.getElementById("companyName").value || '',
		"Email": document.getElementById("email").value || '',
		"PhoneNo": document.getElementById("Phoneno").value || '',
		"CompanyAddress": document.getElementById("address").value || '',
		"City": document.getElementById("city").value || '',
		"PostalCode": document.getElementById("postalCode").value || '',
		"Province": document.getElementById("province").value || ''
	}
	fetch(serverUrl + "/addLead", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new HttpError(response);
		}
	}).then(data => {
		hideLoader(); // hide the loader
		if (data['statusCode'] == 500) {
			alert(data['body'])
		}
		else if (data['statusCode'] == 200) {
			$("#exampleModal").modal('hide');
			//location.href = "./home.html"+ '?user-id=' + USERID;
			alert('Lead added successfully!')
		}
	}).catch(error => {
		hideLoader(); // hide the loader
		alert("Error: " + error);
	});
}

// Update the selected lead in dynamo db
async function updateLead(event) {
	event.preventDefault();
	showLoader() // show the loader
	console.log(USERID, SELECTED_USERID)
	if (USERID == SELECTED_USERID) {
		const body = {
			"LeadId": LEADID, // global variable
			"userId": USERID, // global variable
			"Name": document.getElementById("username").value || '',
			"CompanyName": document.getElementById("companyName").value || '',
			"Email": document.getElementById("email").value || '',
			"PhoneNo": document.getElementById("Phoneno").value || '',
			"CompanyAddress": document.getElementById("address").value || '',
			"City": document.getElementById("city").value || '',
			"PostalCode": document.getElementById("postalCode").value || '',
			"Province": document.getElementById("province").value || ''
		}
		return fetch(serverUrl + "/updateLead", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new HttpError(response);
			}
		}).then(data => {
			hideLoader(); // hide the loader
			if (data['statusCode'] == 200) {
				// Hide modal
				$("#leadPageModal").modal('hide');
				fetchLeads();
				alert("Lead name: " + data['body']['Name'] + " updated succefully")
			}
			else if (data['statusCode'] == 401) {
				//location.href = "./index.html";
				alert(data['body'])
			}
			else {
				//fetchLeads();
				alert(data['body'])
			}
		}).catch(error => {
			hideLoader(); // hide the loader
			alert("Error: " + error);
		});
	}
	else {
		hideLoader(); // hide the loader
		$("#leadPageModal").modal('hide');
		alert('You can only update the lead created by you')
	}
}

// Delete the selected lead in dynamo db
async function deleteLead() {
	showLoader() // show the leader
	if (USERID == SELECTED_USERID) {
		const body = {
			"LeadId": LEADID, // global variable
			"userId": USERID // global variable
		}
		return fetch(serverUrl + "/deleteLead", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new HttpError(response);
			}
		}).then(data => {
			hideLoader(); // hide the loader
			if (data['statusCode'] == 200) {
				// Hide modal
				$("#myModal").modal('hide');
				fetchLeads();
				alert("Lead deleted succefully")
			}
			else if (data['statusCode'] == 401) {
				//location.href = "./index.html";
				alert(data['body'])
			}
			else {
				//fetchLeads();
				alert(data['body'])
			}
		}).catch(error => {
			hideLoader(); // hide the loader
			alert("Error: " + error);
		});
	}
	else {
		hideLoader(); // hide the loader		
		$("#myModal").modal('hide');
		alert('You can only delete the lead created by you')
	}
}

// TO upload the selected image into s3 bucket
async function uploadImage() {
	showLoader()
	// encode input file as base64 string for upload
	let file = document.getElementById("leadImage").files[0];
	console.log("file", file)
	let converter = new Promise(function (resolve, reject) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result
			.toString().replace(/^data:(.*,)?/, ''));
		reader.onerror = (error) => reject(error);
	});
	let encodedString = await converter;

	// clear file upload input field
	document.getElementById("leadImage").value = "";

	// make server call to upload image
	// and return the server upload promise
	return fetch(serverUrl + "/upload_image", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ filename: file.name, filebytes: encodedString })
	}).then(response => {
		hideLoader()
		if (response.ok) {
			console.log("res", response)
			return response.json();
		} else {
			throw new HttpError(response);
		}
	})
}

//Display all leads in table format with few columns.
function viewLeads(jsonData) {
	// Get the table element from HTML'
	showLoader();
	const tbody = document.querySelector('#example tbody');

	if (!tbody) {
		console.error('Unable to find tbody element in the document.');
	}
	tbody.innerHTML = ''
	// Iterate through the JSON data and add rows to the table
	for (let i = 0; i < jsonData.length; i++) {
		// Create a new row
		const row = tbody.insertRow(i);

		// Insert cells into the row
		const companyName = row.insertCell(0);
		const name = row.insertCell(1);
		const email = row.insertCell(2);
		const phoneNo = row.insertCell(3);
		const actionsCell = row.insertCell(4);

		// Fill cells with data
		companyName.innerHTML = jsonData[i].CompanyName;
		name.innerHTML = jsonData[i].Name;
		email.innerHTML = jsonData[i].Email;
		phoneNo.innerHTML = jsonData[i].PhoneNo;

		// Add view, edit, and delete buttons to the actions cell
		/*const viewBtn = document.createElement('button');
		viewBtn.innerText = 'View';
		viewBtn.classList.add("btn", "btn-primary", "btn-sm", "mr-1");
		viewBtn.addEventListener('click', () => {
			// Handle view button click
			openViewPopup()
			console.log(`View button clicked for record with ID ${jsonData[i].LeadId}`);
		});*/

		const editBtn = document.createElement('button');
		editBtn.innerText = 'Edit';
		editBtn.classList.add("btn", "btn-warning", "btn-sm", "mr-1");
		editBtn.addEventListener('click', () => {
			// Handle edit button click
			$("#leadPageModal").modal('show');
			// Populate the fields in the modal popup with the JSON data
			document.getElementById("username").value = jsonData[i].Name || '';
			document.getElementById("companyName").value = jsonData[i].CompanyName || '';
			document.getElementById("email").value = jsonData[i].Email || '';
			document.getElementById("Phoneno").value = jsonData[i].PhoneNo || '';
			document.getElementById("address").value = jsonData[i].CompanyAddress || '';
			document.getElementById("city").value = jsonData[i].City || '';
			document.getElementById("postalCode").value = jsonData[i].PostalCode || '';
			document.getElementById("province").value = jsonData[i].Province || '';
			LEADID = jsonData[i].LeadId
			SELECTED_USERID = jsonData[i].userId
			console.log(LEADID, SELECTED_USERID)
			console.log(`Edit button clicked for record with ID ${jsonData[i].LeadId}`);
		});

		const deleteBtn = document.createElement('button');
		deleteBtn.innerText = 'Delete';
		deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "mr-1");
		deleteBtn.addEventListener('click', () => {
			// Handle delete button click
			$("#myModal").modal('show');
			LEADID = jsonData[i].LeadId
			SELECTED_USERID = jsonData[i].userId
			// Populate the fields in the modal popup with the JSON data
			console.log(`Delete button clicked for record with ID ${jsonData[i].LeadId}`);
		});

		// Append buttons to the actions cell
		//actionsCell.appendChild(viewBtn);
		actionsCell.appendChild(editBtn);
		actionsCell.appendChild(deleteBtn);
	}
	hideLoader(); // hide the loader
}

// Retrieve all leads
async function fetchLeads() {
	showLoader(); // show the leader
	return fetch(serverUrl + "/fetchLeads", {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new HttpError(response);
		}
	}).then(data => {
		if (data['statusCode'] == 500) {
			alert(data['body'])
		}
		else if (data['statusCode'] == 200) {
			viewLeads(data['body']);
		}
		hideLoader(); // hide the loader
	}).catch(error => {
		// Handle errors
		hideLoader(); // hide the loader
		alert(error);
	});
}

//Extract Information
async function translateImage(image) {
	showLoader()
	// make server call to translate image
	// and return the server upload promise
	return fetch(serverUrl + "/images/" + image["fileId"] + "/extract-info", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ fromLang: "auto", toLang: "en" })
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new HttpError(response);
		}
	}).then(data => {
		$("#exampleModal").modal('show');
		// Populate the fields in the modal popup with the JSON data
		document.getElementById("username").value = data['Name'] || '';
		document.getElementById("companyName").value = data['CompanyName'] || '';
		document.getElementById("email").value = data['Email'] || '';
		document.getElementById("Phoneno").value = data['PhoneNo'] || '';
		document.getElementById("address").value = data['address'] || '';
		document.getElementById("city").value = data['city'] || '';
		document.getElementById("postalCode").value = data['postalCode'] || '';
		document.getElementById("province").value = data['province'] || '';
		hideLoader()
	})
}

//Add multiple users
async function uploadCsvToDynamoDB() {
	// Get the selected file
	var fileInput = document.getElementById('file-upload');
	var file = fileInput.files[0];

	// Check if the file is a CSV file
	if (!file.name.endsWith('.csv')) {
		alert('Please select a CSV file!');
		fileInput.value = '';
		return;
	}

	const reader = new FileReader();
	reader.readAsText(file);

	reader.onload = function (event) {
		const data = event.target.result.trim();
		const rows = data.split('\n').map(row => row.split(','));
		const headers = rows.shift();
		const results = rows.map(row => {
			const obj = {};
			headers.forEach((header, i) => obj[header] = row[i]);
			return obj;
		});

		console.log(results);
	};
	/* Call the API
	fetch(serverUrl + "/addMultipleLead", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new HttpError(response);
		}
	}).then(data => {
		hideLoader(); // hide the loader
		if (data['statusCode'] == 500) {
			alert(data['body'])
		}
		else if (data['statusCode'] == 200) {
			//$("#exampleModal").modal('hide');
			//location.href = "./home.html"+ '?user-id=' + USERID;
			alert('Leads added uploaded successfully!');
		}
	}).catch(error => {
		hideLoader(); // hide the loader
		alert('Error uploading CSV file: ' + error);
	});*/
}


// Function executes on pages load to retrieve the id of login user
const init = function (e, page) {
	preloader = document.querySelector("#preloader");
	if (page == 'home') {
		USERID = document.location.search.replace(/^.*?\=/, '')
		document.getElementById('linkToViewLeads').setAttribute('href', "./View_leads.html" + '?user-id=' + USERID)
	}
	if (page == 'viewLeads') {
		USERID = document.location.search.replace(/^.*?\=/, '')
		document.getElementById('linkToHome').setAttribute('href', "./home.html" + '?user-id=' + USERID)
	}
	console.log(USERID)
}

function uploadAndTranslate() {
	console.log(USERID)
	uploadImage()
		//.then(image => updateImage(image))
		.then(image => translateImage(image))
		.catch(error => {
			hideLoader() //hide the loader
			alert("Error: " + error);
		})
}


class HttpError extends Error {
	constructor(response) {
		super(`${response.status} for ${response.url}`);
		this.name = "HttpError";
		this.response = response;
	}
}

/*$(document).ready(function () {

	var table = $('#example').DataTable({

		buttons: ['csv', 'excel']

	});

	example_wrapper
		table.buttons().container()
			.appendTo('#example_wrapper .col-md-6:eq(0)');

});*/
