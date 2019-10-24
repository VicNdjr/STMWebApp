let isTimerActive = false;
let timer;
let lines;
let arrivals;
let geo;
let previousStops = {};

/**
 * Fetch the data about all the bus lines and display it
 */
function displaylines() {
    let xhr = new XMLHttpRequest();
    lines = "";

    xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110');

    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function () {
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
                console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                document.getElementById("allLines").innerHTML += 'Une erreur s\'est produite. Nous n\'avons pas pu charger les lignes.';
                document.getElementById("localLines").innerHTML += 'Une erreur s\'est produite. Nous n\'avons pas pu charger les lignes.';
                document.getElementById("nightLines").innerHTML += 'Une erreur s\'est produite. Nous n\'avons pas pu charger les lignes.';
                document.getElementById("expressLines").innerHTML += 'Une erreur s\'est produite. Nous n\'avons pas pu charger les lignes.';
                document.getElementById("shuttleLines").innerHTML += 'Une erreur s\'est produite. Nous n\'avons pas pu charger les lignes.';
                document.getElementById("shuttleOrLines").innerHTML += 'Une erreur s\'est produite. Nous n\'avons pas pu charger les lignes.';
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

    let str = lineId + '-' + dir;
    //Check if we already have information about this line
    if (previousStops[str] !== undefined) {
        console.log("Pas besoin de call à l'API pour connaitre la ligne " + str);
        currentStop = previousStops[str];
        document.getElementById("allStops").innerHTML = "";
        for (let i = 0; i < currentStop.length; i++) {
            document.getElementById("allStops").innerHTML += '<tr> <td class="stop">' +
                currentStop[i].name + '</td>' + '<td class="code">' + currentStop[i].id +
                '<td class="time" id="' + lineId + '-' + dir + '-' + currentStop[i].id +
                '" onclick="displayTimer(this.id)"><a href="#times-tab">[...]</a></td> <td class="fav">+</td>';
        }
        affiche_carte2();
    } else {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMStops.py' +
            '?apikey=01AQ42110&route=' + lineId + '&direction=' + dir);
        xhr.responseType = 'text';

        //ASYNCHRONE
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    currentStop = JSON.parse(xhr.responseText);
                    previousStops[str] = currentStop;
                    // Display the stops
                    document.getElementById("allStops").innerHTML = "";
                    for (let i = 0; i < currentStop.length; i++) {
                        document.getElementById("allStops").innerHTML += '<tr> <td class="stop">' +
                            currentStop[i].name + '</td>' + '<td class="code">' + currentStop[i].id +
                            '<td class="time" id="' + lineId + '-' + dir + '-' + currentStop[i].id +
                            '" onclick="displayTimer(this.id)"><a href="#times-tab">[...]</a></td> <td class="fav">+</td>';
                    }
                    affiche_carte2();
                } else {
                    console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                    document.getElementById("allStops").innerHTML = 'Une erreur s\'est produite. Nous n\'avons pas pu charger les arrêts.';
                }

            }
        };
            xhr.send();
        }
    }

    /**
     * Launch a timer to actualise the time table every 5 seconds
     * @param stop Id of the stop that was clicked
     */
    function displayTimer(stop) {
        if (isTimerActive === false) {
            callAPI(stop);
            timer = setInterval(function () {
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
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
            '?apikey=01AQ42110&route=' + splitted[0] + '&direction=' + splitted[1] + '&stopCode=' + splitted[2]);
        xhr.responseType = 'text';

        //ASYNCHRONE
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    arrivals = JSON.parse(xhr.responseText);
                    displayOneStop(stop);
                } else {
                    console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                    document.getElementById("allTimes").innerHTML = 'Une erreur s\'est produite. Nous n\'avons pas pu charger les arrêts.';
                }
            }
        };
        xhr.send();
    }

    /**
     * Display the stop and its timetable
     * @param stop Id of the stop that was clicked
     */
    function displayOneStop(stop) {
        console.log("Rafraichissement des horaires de passage.");
        let name;

        // Get actual date and time
        const splitted = stop.split("-");
        for (let i = 0; i < currentStop.length; i++) {
            if (currentStop[i].id === splitted[2]) {
                name = currentStop[i].name;
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
                    ' minute(s)</td> </tr>';
            }
        }

        // If no arrival have been found
        if (counter === 0) {
            document.getElementById("allTimes").innerHTML = '<tr>Il n\'y a plus de bus ' +
                'aujourd\'hui ! </tr>';
        }
    }
