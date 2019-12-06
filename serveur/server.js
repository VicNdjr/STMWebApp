const call = require("./callsAPI");
const fs = require('fs');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//send js, css and images files
app.use(express.static('../client'));

// Index page
app.get('/', function (req, res) {
    fs.readFile("../client/index.html", "UTF-8", function (err, html) {
        res.send(html);
    });
});

// API page for the lines
app.get("/lines", function (req, res) {
    call.fetchLines(res);
});

// API page for the stops
app.get("/stops/:route/:dir", function (req, res) {
    let route = req.params.route;
    let direction = req.params.dir;
    call.fetchStops(res, route, direction)
});

// API page for the arrivals
app.get("/arrivals/:route/:dir/:stopCode", function (req, res) {
    let route = req.params.route;
    let direction = req.params.dir;
    let stop = req.params.stopCode;
    call.fetchArrivals(res, route, direction, stop);
});

// API page for the bus positions
app.get("/positions/:route/:dir", function (req, res) {
    let route = req.params.route;
    let direction = req.params.dir;
    call.fetchPositions(res, route, direction);
});

app.get("/favorites/:user", function (req, res) {
    let user = req.params.user;
    call.fetchFavorites(res, user);
});

app.put("/favorites/:user", function (req, res) {
    let user = req.params.user;
    let favorites = req.body;
    call.addFavorite(res, user, favorites);
});


app.listen(8080, function () {
    // Print the link to ease access
    console.log("http://localhost:8080/");
});