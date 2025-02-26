const urlBase = 'http://www.cop4331-group20.xyz/API';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	if (login == "" || password == "") {
		loginErrorMessage.innerHTML = "Must enter Username/Password!";
		return;
	}
//	document.getElementById("loginResult").innerHTML = "";
	
	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	url = urlBase + '/Login.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log(xhr.responseText);
				try {
					let jsonObject = JSON.parse( xhr.responseText );
				} catch {
					loginErrorMessage.innerHTML = "Invalid Username/Password!";
					return;
				}
				let jsonObject = JSON.parse( xhr.responseText );

				userId = jsonObject.id;
		
				if( userId < 1 )
				{	
					return;
				} 

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "search.html";
			}
		};
		console.log("Sending JSON data:", jsonPayload);
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
    // Reset session variables in JavaScript
    userId = 0;
    firstName = "";
    lastName = "";

    // Delete any cookies that might store user data (e.g., firstName, userId)
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

	url = urlBase + '/Logout.' + extension;

    // Optionally, destroy the session on the server-side (if using PHP for session management)
    // This would be an AJAX call to a logout PHP script on the server to handle session destruction
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);  // Make sure you have a PHP logout endpoint to destroy the session
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Redirect to the login page after server session is destroyed
            window.location.href = "index.html";
        }
    };
    xhr.send();
}

function createUser()
{
	let newFirst = document.getElementById("firstName").value;
	let newLast = document.getElementById("lastName").value;
	let newLogin = document.getElementById("username").value;
	let newPassword = document.getElementById("password").value;
//	document.getElementById("userAddResult").innerHTML = "";

	userCreatedMessage.innerHTML = "";
	userErrorMessage.innerHTML = "";

	if(newFirst == "" || newLast == "" || newLogin == "" || newPassword == "") 
	{
		userErrorMessage.innerHTML = "All fields are required!";
        return;
	}

	let tmp = {firstName:newFirst,lastName:newLast,username:newLogin,password:newPassword};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddUser.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				userCreatedMessage.innerHTML = "User Created!";
//				document.getElementById("userAddResult").innerHTML = "User has been added";
			}
		};
		console.log("Sending JSON data:", jsonPayload);
		xhr.send(jsonPayload);
	}
	catch(err)
	{
//		document.getElementById("userAddResult").innerHTML = err.message;
	}
}

/*document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("search.html")) {  // Ensure it's not the login page
        loadContacts();  // Run the function only if not on the login page
    }
});
async function loadContacts() {
    try {
		url = urlBase + '/loadContacts.' + extension
        const response = await fetch(url); // Change from localhost
        const contacts = await response.json();
        const container = document.getElementById("container");

        container.innerHTML = ""; // Clear previous content

		const headerCard = document.createElement("div");
		headerCard.classList.add("headerCard");
		headerCard.innerHTML = `
			<span><strong>ID</strong></span>
			<span><strong>Name</strong></span>
			<span><strong>Phone</strong></span>
			<span><strong>Email</strong></span>
			<span><strong>Update/Delete</strong></span>
		`;
		container.appendChild(headerCard);

        contacts.forEach(contact => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
				<span><strong></strong> ${contact.id}</span>
        		<span><strong></strong> ${contact.firstName} ${contact.lastName}</span>
        		<span><strong></strong> ${contact.phone}</span>
        		<span><strong></strong> ${contact.email}</span>
				<div class="button">
					<button class="update" onclick="openUpdateModal(${contact.id}, '${contact.firstName}', '${contact.lastName}', '${contact.phone}', '${contact.email}')">&#9998;</button>
            		<button class="delete" onclick="deleteContact(${contact.id}, '${contact.firstName}')">&#10006;</button>
				</div>
			`;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading contacts:", error);
    }
}*/

// Open the modal
function openAddModal() {
	document.getElementById("addModal").style.display = "block";
}

// Close the modal
function closeAddModal() {
	document.getElementById("addModal").style.display = "none";
	addErrorMessage.innerHTML = "";
}

function createContact()
{
	let newFirst = document.getElementById("contactFirstName").value;
	let newLast = document.getElementById("contactLastName").value;
	let newPhone = document.getElementById("contactPhone").value;
	let newEmail = document.getElementById("contactEmail").value;
	//document.getElementById("contactAddResult").innerHTML = "";

	addErrorMessage.innerHTML = "";

	if(newFirst == "" || newLast == "" || newPhone == "" || newEmail == "") 
	{
		addErrorMessage.innerHTML = "All fields are required!";
        return;
	}

	let tmp = {firstName:newFirst,lastName:newLast,phone:newPhone,email:newEmail};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/createContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				searchContact();
				closeAddModal();
				document.getElementById("addContactForm").reset();
	//			document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
	//	document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("search.html")) {  // Ensure it's not the login page
        searchContact();  // Run the function only if not on the login page
    }
});
async function searchContact() {
    try {
        let searchTerm = document.getElementById("searchTerm").value;
        let tmp = {searchTerm:searchTerm};
        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + "/searchContact." + extension; // Ensure URL is correct

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonPayload,
        });

        const contacts = await response.json();
        const container = document.getElementById("container");
        container.innerHTML = ""; // Clear previous content

        // Show error if no contacts are found
        if (contacts.error) {
            container.innerHTML = `<div style="color: white; text-align: center;">${contacts.error}</div>`;
            return;
        }

        // Create a header row for the contact list
        const headerCard = document.createElement("div");
        headerCard.classList.add("headerCard");
        headerCard.innerHTML = `
            <span><strong>ID</strong></span>
            <span><strong>Name</strong></span>
            <span><strong>Phone</strong></span>
            <span><strong>Email</strong></span>
            <span><strong>Update/Delete</strong></span>
        `;
        container.appendChild(headerCard);

        // Loop through contacts and display each one
        contacts.forEach(contact => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <span><strong></strong> ${contact.id}</span>
                <span><strong></strong> ${contact.firstName} ${contact.lastName}</span>
                <span><strong></strong> ${contact.phone}</span>
                <span><strong></strong> ${contact.email}</span>
                <div class="button">
                    <button class="update" onclick="openUpdateModal(${contact.id}, '${contact.firstName}', '${contact.lastName}', '${contact.phone}', '${contact.email}')">&#9998;</button>
                    <button class="delete" onclick="deleteContact(${contact.id}, '${contact.firstName}')">&#10006;</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error searching contacts:", error);
    }
}

function deleteContact(contactId, firstName)
{ 
	if (confirm("Are you sure you want to delete " + firstName + "?")) {
		let tmp = {contactId:contactId};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + '/deleteContact.' + extension;
	
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					searchContact();
	//				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
		//	document.getElementById("contactAddResult").innerHTML = err.message;
		}
	}
}

function openUpdateModal(contactId, firstName, lastName, phone, email) {
	document.getElementById("contactId").value = contactId; // Store ID
    document.getElementById("editContactFirstName").value = firstName; // Pre-fill first name
    document.getElementById("editContactLastName").value = lastName; // Pre-fill last name
    document.getElementById("editContactPhone").value = phone; // Pre-fill phone
    document.getElementById("editContactEmail").value = email; // Pre-fill email
	document.getElementById("updateModal").style.display = "block";
}

// Close the modal
function closeUpdateModal() {
	document.getElementById("updateModal").style.display = "none";
	updateErrorMessage.innerHTML = "";
}

function updateContact() {
	let contactId = document.getElementById("contactId").value;
	let newFirst = document.getElementById("editContactFirstName").value;
	let newLast = document.getElementById("editContactLastName").value;
	let newPhone = document.getElementById("editContactPhone").value;
	let newEmail = document.getElementById("editContactEmail").value;
	//document.getElementById("contactAddResult").innerHTML = "";

	updateErrorMessage.innerHTML = "";

	if(newFirst == "" || newLast == "" || newPhone == "" || newEmail == "") 
	{
		updateErrorMessage.innerHTML = "All fields are required!";
        return;
	}

	let tmp = {id:contactId,firstName:newFirst,lastName:newLast,phone:newPhone,email:newEmail};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/updateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				searchContact();
				closeUpdateModal();
	//			document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
	//	document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}