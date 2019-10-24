let isTimerActive = false;
let timer;
let lines;
let arrivals;
let geo;

/**
 * Fetch the data about all the bus lines and display it
 */
function displaylines() {
    var xhr = new XMLHttpRequest();
    lines = "";

    xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110');

    xhr.responseType = 'text';

    //AFFICHE LES LIGNES
    xhr.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                lines = JSON.parse(xhr.responseText);
                for (let i = 0; i < lines.length; i++) {
                    document.getElementById("allLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                        lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                        lines[i].direction + ')' + '</li>';

                    if (lines[i].category === 'local') {
                        document.getElementById("localLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                            lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                            lines[i].direction + ')' + '</li>';
                    } else if (lines[i].category === 'night') {
                        document.getElementById("nightLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                            lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                            lines[i].direction + ')' + '</li>';
                    } else if (lines[i].category === 'express') {
                        document.getElementById("expressLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                            lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                            lines[i].direction + ')' + '</li>';
                    } else if (lines[i].category === 'dedicated') {
                        document.getElementById("shuttleLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                            lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                            lines[i].direction + ')' + '</li>';
                    } else if (lines[i].category === 'shuttleOr') {
                        document.getElementById("shuttleOrLines").innerHTML += '<li id="line-' + lines[i].id + '-' +
                            lines[i].direction + '" onclick="openLine(this.id)">' + lines[i].id + ' ' + lines[i].name + ' (' +
                            lines[i].direction + ')' + '</li>';
                    }
                }
            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };

    xhr.send();
}

/**
 * Send all informations about the clicked line to the display function
 * @param line Id of the line that was clicked
 */
function openLine(line) {
    currentLine = line;
    const splitted = line.split("-");
    displayOneLine(splitted[1], splitted[2]);
}

/**
 * Display the line and all its stops in the table
 * @param lineId Id of the line that was clicked
 * @param direction Direction of the line that was clicked
 */
function displayOneLine(lineId, direction) {
    let line;
    for (line of lines) {
        if (line.id === lineId && line.direction === direction) {
            document.getElementById("textChosenLine").innerText = line.id + ' ' + line.name + ' ' +
                line.direction;
            console.log(line);
        }

    }
    // Handle the language conversion
    let dir;
    if (direction.charAt(0) === "O")
        dir = 'W';
    else
        dir = direction.charAt(0);

    const str = lineId + '-' + dir;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMStops.py' +
        '?apikey=01AQ42110&route=' + lineId + '&direction=' + dir);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                currentstop = JSON.parse(xhr.responseText);
                console.log(currentstop[0]);

                // Display the stops
                document.getElementById("allStops").innerHTML = "";
                for (let i = 0; i < currentstop.length; i++) {
                    document.getElementById("allStops").innerHTML += '<tr> <td class="stop">' +
                        currentstop[i].name + '</td>' + '<td class="code">' + currentstop[i].id +
                        '<td class="time" id="' + lineId + '-' + dir + '-' + currentstop[i].id +
                        '" onclick="displayTimer(this.id)"><a href="#times-tab">[...]</a></td> <td class="fav">+</td>';
                }
                affiche_carte2();
            }
        } else {
            console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
        }
    };
    xhr.send();
}

/**
 * Launch a timer to actualise the time table every 5 seconds
 * @param stop Id of the stop that was clicked
 */
function displayTimer(stop) {
    if (isTimerActive === false) {
        callAPI(stop);
        timer = setInterval(function() {
            callAPI(stop);
        }, 10000);
        isTimerActive = true;
    } else {
        clearInterval(timer);
        isTimerActive = false;
        displayTimer(stop);
    }
}

function callAPI(stop) {
    const splitted = stop.split("-");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
        '?apikey=01AQ42110&route=' + splitted[0] + '&direction=' + splitted[1] + '&stopCode=' + splitted[2]);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                arrivals = JSON.parse(xhr.responseText);
                displayOneStop(stop);
            }
        } else {
            console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
        }
    };
    xhr.send();
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

    for (var i = 0; i < currentstop.length; i++) {
        if (currentstop[i].id === splitted[2]) {
            var name = currentstop[i].name;
        }
    }
    // Display the name of the stop
    document.getElementById("textChosenStop").innerHTML = "Prochains passages pour l'arrêt " + name;

    // Clear the html
    document.getElementById("allTimes").innerHTML = '';

    // Display max 10 arrivals
    let counter = 0;
    for (let i = 0; i < arrivals.length && counter < 10; i++) {
        counter++;
        if (arrivals[i].length === 4) {
            document.getElementById("allTimes").innerHTML += '<tr> <td class="hour">' +
                arrivals[i].slice(0, 2) + ':' + arrivals[i].slice(2, 4) + '</td> </tr>';
        } else {
            document.getElementById("allTimes").innerHTML += '<tr> <td class="minutes">' + arrivals[i] +
                '</td> </tr>';
        }
    }

    // If no arrival have been found
    if (counter === 0) {
        document.getElementById("allTimes").innerHTML = '<tr>Il n\'y a plus de bus ' +
            'aujourd\'hui ! </tr>';
    }
}