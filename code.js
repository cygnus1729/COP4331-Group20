const urlBase = 'http://localhost/API';
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
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{	
//					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createUser()
{
	let newFirst = document.getElementById("firstName").value;
	let newLast = document.getElementById("lastName").value;
	let newLogin = document.getElementById("username").value;
	let newPassword = document.getElementById("password").value;
//	document.getElementById("userAddResult").innerHTML = "";

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

// Open the modal
function openAddModal() {
	document.getElementById("addModal").style.display = "block";
}

// Close the modal
function closeModal() {
	document.getElementById("addModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", loadContacts);
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
					<button class="update" onclick="updateContact(${contact.id})">&#9998;</button>
            		<button class="delete" onclick="deleteContact(${contact.id}, '${contact.firstName}')">&#10006;</button>
				</div>
			`;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading contacts:", error);
    }
}

function createContact()
{
	let newFirst = document.getElementById("contactFirstName").value;
	let newLast = document.getElementById("contactLastName").value;
	let newPhone = document.getElementById("contactPhone").value;
	let newEmail = document.getElementById("contactEmail").value;
	//document.getElementById("contactAddResult").innerHTML = "";

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
				loadContacts();
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

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/searchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
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
					loadContacts();
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