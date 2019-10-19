let isTimerActive = false;
let timer;
let lines;

function testAPI() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        console.log("hey");
        if (req.status === 200){
            lines = req.responseText.toString();
            console.log("Réponse reçue: %s", lines);
            if (lines.length > 0){
                console.log("OK");
                fetchLines();
            }
            //lines = req.responseText;
            //fetchLines();
        } else {
            console.log("Status de la réponse: %s", req.responseText);
        }
        //lines = req.responseText;
    };
    req.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110', true);
    //req.open('GET', url);
    req.send();
}


/**
 * Fetch the data about all the bus lines and display it
 */
function fetchLines() {
    for (let i = 0; i < lines.length; i++) {
        document.getElementById("allLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
            lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
            lines[i].direction + ')' + '</li>';

        if (lines[i].category === 'local') {
            document.getElementById("localLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }
        else if (lines[i].category === 'night') {
            document.getElementById("nightLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }
        else if (lines[i].category === 'express') {
            document.getElementById("expressLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }
        else if (lines[i].category === 'dedicated') {
            document.getElementById("shuttleLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }
        else if (lines[i].category === 'shuttleOr') {
            document.getElementById("shuttleOrLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                lines[i].direction + ')' + '</li>';
        }
    }
}

/**
 * Send all informations about the clicked line to the display function
 * @param line Id of the line that was clicked
 */
function openLine(line) {
    const splitted = line.split("-");
    displayOneLine(splitted[1], splitted[2])
}

/**
 * Display the line and all its stops in the table
 * @param lineId Id of the line that was clicked
 * @param direction Direction of the line that was clicked
 */
function displayOneLine(lineId, direction) {
    let line;
    for (line of lines) {
        if (line.id === lineId && line.direction === direction)
            document.getElementById("textChosenLine").innerText = line.id + ' ' + line.name + ' '
                + line.direction;
    }
    // Handle the language conversion
    let dir;
    if (direction.charAt(0) === "O")
        dir = 'W';
    else
        dir = direction.charAt(0);

    const str = lineId + '-' + dir;

    for (let line in stops) {
        if (line === str) {
            // Clear the html
            document.getElementById("allStops").innerHTML = '';

            // Display the stops
            for (let i = 0; i < stops[line].length; i++) {
                document.getElementById("allStops").innerHTML += '<tr> <td class="stop">' +
                    stops[line][i].name + '</td>' + '<td class="code">' + stops[line][i].id +
                    '<td class="time" id="' + lineId + '-' + dir + '-' + stops[line][i].id +
                    '" onclick="displayTimer(this.id)"><a href="#times-tab">[...]</a></td> <td class="fav">+</td>';
            }
        }
    }
}

/**
 * Launch a timer to actualise the time table every 5 seconds
 * @param stop Id of the stop that was clicked
 */
function displayTimer(stop) {
    if (isTimerActive === false) {
        displayOneStop(stop);

        timer = setInterval(function () {
            displayOneStop(stop);
        }, 5000);
        isTimerActive = true;
    }
    else {
        clearInterval(timer);
        isTimerActive = false;

        displayTimer(stop);
    }
}

/**
 * Display the stop and its timetable
 * @param stop Id of the stop that was clicked
 */
function displayOneStop(stop) {
    console.log("refresh");
    // Get actual date and time
    let today = new Date();

    const splitted = stop.split("-");
    let str = splitted[0] + '-' + splitted[1];

    // Display the name of the stop
    let s;
    for (s of stops[str]) {
        if (s.id === splitted[2])
            document.getElementById("textChosenStop").innerHTML = "Prochains passages pour l'arrêt " + s.name;
    }

    // Clear the html
    document.getElementById("allTimes").innerHTML = '';

    // Display max 10 arrivals
    let counter = 0;
    for (let i = 0; i < arrivals[stop].length && counter < 10; i++) {
        if (parseInt(arrivals[stop][i].slice(0, 2), 10) >= today.getHours() &&
            parseInt(arrivals[stop][i].slice(2, 4), 10) >= today.getMinutes()) {
            counter++;
            document.getElementById("allTimes").innerHTML += '<tr> <td class="test">' +
                arrivals[stop][i].slice(0, 2) + ' : ' + arrivals[stop][i].slice(2, 4) + '</td> </tr>';
        }
    }

    // If no arrival have been found
    if (counter === 0) {
        document.getElementById("allTimes").innerHTML = '<tr>Il n\'y a plus de bus ' +
            'aujourd\'hui ! </tr>';
    }
}