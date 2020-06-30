/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const generate_btn = document.querySelector("#generate");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Personal API Key for OpenWeatherMap API
// use your own key please
const apiKey = '';

// Event listener to add function to existing HTML DOM element
document.addEventListener("DOMContentLoaded", function(){
	getRecentEntry();
	generate_btn.addEventListener('click', submit_entry);
});

/* Function called by event listener */
const submit_entry = async()=>{
	/* validate form inputs aren't empty */
	let inputs_are_valid = true;

	// check if zip field is not empty 
	let zip = document.querySelector('#zip');
	if(zip.value.trim() == ""){
		alert('Oh no you forgot to type a zip code');
		inputs_are_valid = false;
	}

	// check if feelings field is not empty 
	let feelings = document.querySelector('#feelings');
	if(feelings.value.trim() == ""){
		alert('Oh no you forgot to type how you feel');
		inputs_are_valid = false;
	}

	if(inputs_are_valid){
		// disable submit button until requests are done, and to avoid duplication
		generate_btn.disabled = true;

		// get temp from weather api
		await getWebAPIData(baseUrl, zip.value, apiKey)
		.then(async temp => {
			// then submit call via post request to the server
			await postEntry({
				timestamp: newDate,
				temp,
				content: feelings.value
			});
		});

		// enable button back again
		generate_btn.disabled = false;

		// make it easy to type another entry
		feelings.value = "";
		feelings.focus();
	}
}

/* Function to GET Web API Data*/
const getWebAPIData = async (baseUrl, zip, apiKey) => await fetch(baseUrl+`?zip=${zip}`+`&appid=${apiKey}`)
	.then(res => res.json())
	.then(data => data.main.temp)
	.catch(error => console.log(error));

/* Function to POST data */
const postEntry = async (data={})=> fetch('/userEntry', {
		method: "POST", 
		credentials: 'same-origin',
	     headers: {
	        'Content-Type': 'application/json',
	    },
	    body:JSON.stringify(data)
	})
	.then(res => res.json())
	.then(data => populateEntry(data));

/* Function to GET Project Data */
const getRecentEntry = ()=> fetch('/userRecentEntry')
	.then(res => res.json())
	.then(data=> populateEntry(data))
	.catch(error => console.log(error));

/* populate most recent entry */
const populateEntry = data => {
	document.querySelector("#date").innerHTML = `Date ${data.timestamp}`;
	document.querySelector("#temp").innerHTML = `Temp: ${data.temp}`;
	document.querySelector("#content").innerHTML = `Feelnig: ${data.content}`;
}