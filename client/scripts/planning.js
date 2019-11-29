/**
 * Display the planning
 */
function affiche_horaires() {
    document.getElementById("div-carte").style.display = "none";
    document.getElementById("div-favoris").style.display = "none";
    document.getElementById("tabs-horaires").style.display = "block";
    clearTimers();
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
        displayStops(lineId, dir);
    } else {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost:8080/stops/' + lineId + '/' + dir);
        xhr.responseType = 'text';

        //ASYNCHRONE
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    currentStop = JSON.parse(xhr.responseText);
                    previousStops[str] = currentStop;
                    // Display the stops
                    displayStops(lineId, dir);
                } else {
                    console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                    document.getElementById("allStops").innerHTML =
                        'Une erreur s\'est produite. Nous n\'avons pas pu charger les arrêts.';
                }

            }
        };
        xhr.send();
    }
}

function displayStops(lineId, dir) {
    let id;
    let element;
    let html;
    let elementId = "allTimes";
    document.getElementById("allStops").innerHTML = "";
    for (let i = 0; i < currentStop.length; i++) {
        id = lineId + '-' + dir + '-' + currentStop[i].id;
        element = document.getElementById("allStops");
        html = '<tr> <td class="stop">' +
            currentStop[i].name + '</td>' + '<td class="code">' + currentStop[i].id + '</td>' +
            '<td class="time" id="' + lineId + '-' + dir + '-' + currentStop[i].id +
            '" onclick="displayTimer(this.id,\'' + elementId + '\')"><a href="#times-tab">[...]</a></td>';
        if (is_fav(id) === false) {
            html += '<td class="fav"><button class="button-grey" id=" a-' +
                id + '" onclick="add_fav(this.id)">+</button></td></tr>';
        } else {
            html += '<td class="fav"><button class="button-green" id=" a-' +
                id + '" onclick="add_fav(this.id)">&#10003;</button></td></tr>'
        }
        element.innerHTML += html;
    }
    affiche_carte2();
}

/**
 * Launch a timer to actualise the time table every 5 seconds
 * @param stop Id of the stop that was clicked
 * @param elementId
 */
function displayTimer(stop, elementId) {
    if (isTimerActive === false) {
        fetchArrivals(stop, elementId);
        timer = setInterval(function () {
            fetchArrivals(stop, elementId);
        }, 10000);
        isTimerActive = true;
    } else {
        clearInterval(timer);
        isTimerActive = false;
        displayTimer(stop, elementId);
    }
}

/**
 * Fetch the data about all the bus arrivals and store it in a variable
 * @param stop Id of the stop that was clicked
 * @param elementId
 */
function fetchArrivals(stop, elementId) {
    const splitted = stop.split("-");
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/arrivals/' + splitted[0] + '/' + splitted[1] + '/' + splitted[2]);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                arrivals = JSON.parse(xhr.responseText);
                displayOneStop(stop, elementId);
            } else {
                console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                document.getElementById(elementId).innerHTML = 'Une erreur s\'est produite. Nous n\'avons pas pu charger les arrêts.';
            }
        }
    };
    xhr.send();
}

/**
 * Display the stop and its timetable
 * @param stop Id of the stop that was clicked
 * @param elementId
 */
function displayOneStop(stop, elementId) {
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
    document.getElementById(elementId).innerHTML = '';

    // Display max 10 arrivals
    let counter = 0;
    for (let i = 0; i < arrivals.length && counter < 10; i++) {
        counter++;
        if (arrivals[i].length === 4) {
            document.getElementById(elementId).innerHTML += '<tr> <td class="hour">' +
                arrivals[i].slice(0, 2) + ':' + arrivals[i].slice(2, 4) + '</td> </tr>';
        } else {
            document.getElementById(elementId).innerHTML += '<tr> <td class="minutes">' + arrivals[i] +
                ' minute(s)</td> </tr>';
        }
    }

    // If no arrival have been found
    if (counter === 0) {
        document.getElementById(elementId).innerHTML = '<tr>Il n\'y a plus de bus ' +
            'aujourd\'hui ! </tr>';
    }
}
