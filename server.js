const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

// Start up an instance of app
const app = express();

// Setup empty JS object to act as endpoint for all routes
let projectData = {
	timestamp: "",
	temp: "",
	content: ""
};


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Initialize the main project folder
app.use(express.static('website'));
// Cors for cross origin allowance
app.use(cors());
/* Middleware*/

// Setup Server
app.listen(process.env.PORT, function () {
  console.log('CORS-enabled web server listening on port http://localhost:' + process.env.PORT);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/weather.html');
});

app.post('/userEntry', function (req, res) {
  projectData = req.body;
  res.send(projectData);
});

app.get('/userRecentEntry', function (req, res) {
  res.send(projectData);
});