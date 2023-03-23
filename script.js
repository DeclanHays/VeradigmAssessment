const http = require("http");
const path = require("path");
const ejs = require("ejs"); 
const express = require("express");
const { parse } = require("path");
const bodyParser = require("body-parser"); /* To handle post parameters */
const portNumber = 5000;
const app = express();

const doctorsList = require('./doctors.json');
const parsedList = JSON.parse(JSON.stringify(doctorsList));

/* directory where templates will reside */
app.set("views", path.resolve(__dirname, "templates"));
/* view/templating engine */
app.set("view engine", "ejs");

/* Middleware */
app.use(bodyParser.urlencoded({extended:false}));


/* Displays the main page */
app.get("/", (request, response) => {
  let select = "";

  for (let i = 0; i < parsedList.doctors.length; i++) {
      select += "<option value='" + parsedList.doctors[i].name + "'" +">" + parsedList.doctors[i].name + ", " + parsedList.doctors[i].specialty + ", " + parsedList.doctors[i].location + "</option>"
  }

  const variables = {
      doctor: select
  }
  response.render("home", variables)
});

app.post("/home", (request, response) => {
  let { doctorSelected } = request.body;
  let chosenDoc;
  
  for (let i = 0; i < parsedList.doctors.length; i++) {
    if (parsedList.doctors[i].name === doctorSelected) {
      chosenDoc = parsedList.doctors[i];
    }
  }

  // Sorts doctors based on location of chosen doctor
  parsedList.doctors.sort( (a,b) => {
    if (a.location === chosenDoc.location && b.location === chosenDoc.location) {
      return 0;
    } else if (a.location === chosenDoc.location) {
      return -1;
    } else if (b.location === chosenDoc.location) {
      return 1;
    } else {
      return 0;
    }
  })

  let table = "<table border='1'";
  table += "<tr>";
  table += "<td>" + "<strong>Name<strong>" + "</td>";
  table += "<td>" + "<strong>Specialty<strong>" + "</td>";
  table += "<td>" + "<strong>Location<strong>" + "</td>";
  table += "<td>" + "<strong>Stars / 5<strong>" + "</td>";
  table += "</tr>";
  for (let i = 0; i < parsedList.doctors.length; i++) {
    table += "<tr>";
    table += "<td>" + parsedList.doctors[i].name + "</td>";
    table += "<td>" + parsedList.doctors[i].specialty + "</td>";
    table += "<td>" + parsedList.doctors[i].location + "</td>";
    table += "<td>" + parsedList.doctors[i].rating + "</td>";
    table += "</tr>";
  }

  let doc = chosenDoc.name + ", " + chosenDoc.specialty + ", " + chosenDoc.location + ", " + chosenDoc.rating
  /* Creates a row in the table for each selected item */ 
  const variables = {
    selectedDoctor: doc,
    doctorAndRecommendations: table
  }

  response.render("doctorDisplay", variables);
});

app.listen(process.env.PORT);
