let bus;
let markers = [];
let path = [];
let pathFav = [];
let line;
let lineFavoris;
let busPos = [];
let busPosFav = [];
let busMarker = [];
let busMarkerFav = [];
let nameStop;
let timerBus;
let timerBusFav;
let stopArrivals;
let listFavorites = [];
let markersFav = [];
let arretFav;

/**
 * Display the map
 */
function affiche_carte() {
    document.getElementById("tabs-horaires").style.display = "none";
    document.getElementById("div-favoris").style.display = "none";
    document.getElementById("div-carte").style.display = "block";
    clearTimers();
    affiche_carte2();
}


// creation carte et centrage
let mymap = L.map('mapid').setView([45.505, -73.600], 12.5);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ3RpNTI1IiwiYSI6ImNrMW05cjRlZTBlMWIzY21uYWxpNjh2dmEifQ.9BAMULLZprP9pm2-70Q84g'
}).addTo(mymap);


// icone de bus
let iconeBus = L.icon({
    iconUrl: 'images/bus.png',
    iconSize: [22, 22]
});


/**
 * Update the map
 */
function affiche_carte2() {
    clearMap();
    if (currentStop) {
        for (let i = 0; i < currentStop.length; i++) {
            let arret = [parseFloat(currentStop[i].lat), parseFloat(currentStop[i].lon)];
            markers[i] = L.marker(arret).addTo(mymap);
            markers[i].on('click', function () {
                callAPIStops(splittedLine[1], dirLine, currentStop[i].id, i)
            });
            path.push(arret);

            let splittedLine = currentLine.split("-");
            let dirLine = splittedLine[2].substr(0, 1);
            if (dirLine === 'O') {
                dirLine = 'W';
            }
            markers[i].bindPopup("<b>" + currentStop[i].name + "</b><br>",);

        }
        line = L.polyline(path, {color: '#00aeef'}).addTo(mymap);
        busFunction();
        timerBus = setInterval(function () {
            busFunction();
        }, 5000);
        mymap.fitBounds([
            [parseFloat(currentStop[0].lat), parseFloat(currentStop[0].lon)],
            [parseFloat(currentStop[currentStop.length - 1].lat), parseFloat(currentStop[currentStop.length - 1].lon)]
        ]);

    }

    if (favorites) {
        let lineFav = "";
        let dirFav = "";
        let stopFav = "";
        for (let i = 0; i < favorites.length; i++) {
            lineFav = favorites[i].split('-')[1];
            dirFav = favorites[i].split('-')[2];
            stopFav = favorites[i].split('-')[3];
            callAPIPos(lineFav,dirFav);
            pathFav = [];
            for (let j = 0 ; j < listFavorites.length; j++) {
                arretFav = [parseFloat(listFavorites[j].lat), parseFloat(listFavorites[j].lon)];
                if (listFavorites[j].id == stopFav) {
                    markersFav[j] = L.marker(arretFav).addTo(mymap);
                    markersFav[j].bindPopup("<b>" + listFavorites[j].name + "</b><br>",);
                }
                pathFav.push(arretFav);
            }
            lineFavoris = L.polyline(pathFav, {color: 'green'}).addTo(mymap);

            // callAPIBusFav(lineFav,dirFav);
            // timerBusFav = setInterval(function () {
            //     callAPIBusFav(lineFav,dirFav);
            // }, 10000);
        }

    }
}

/**
 * Clear the map
 */
function clearMap() {
    for (let i = 0; i < markers.length; i++) {
        if (markers[i] !== undefined) {
            mymap.removeLayer(markers[i]);
        }
    }
    for (let i = 0; i < markersFav.length; i++) {
        if (markersFav[i] !== undefined) {
            mymap.removeLayer(markersFav[i]);
        }
    }
    path = [];
    pathFav = [];
    if (line !== undefined) {
        mymap.removeLayer(line);
    }
    line = undefined;
    if (lineFavoris !== undefined) {
        mymap.removeLayer(lineFavoris);
    }
    lineFavoris = undefined;
    busPos = [];
    for (let i = 0; i < busMarker.length; i++) {
        if (busMarker[i] !== undefined) {
            mymap.removeLayer(busMarker[i]);
        }
    }
    busMarker = [];
    // busPosFav = [];
    // for (let i = 0; i < busMarkerFav.length; i++) {
    //     if (busMarkerFav[i] !== undefined) {
    //         mymap.removeLayer(busMarkerFav[i]);
    //     }
    // }
    // busMarkerFav = [];
    clearInterval(timerBus);
    // clearInterval(timerBusFav);
}


/**
 * Display the busses on the map
 */
function busFunction() {
    let splittedLine = currentLine.split("-");
    let dirLine = splittedLine[2].substr(0, 1);
    if (dirLine === 'O') {
        dirLine = 'W';
    }
    callAPIBus(splittedLine[1], dirLine);
}

/**
 * Make a call to the API
 * @param line The bus line
 * @param dir The direction of the bus line
 */
function callAPIBus(line, dir) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/positions/' + line + '/' + dir);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                let bus = JSON.parse(xhr.responseText);
                busPos = [];
                for (let i = 0; i < busMarker.length; i++) {
                    if (busMarker[i] !== undefined) {
                        mymap.removeLayer(busMarker[i]);
                    }
                }
                busMarker = [];
                for (let i = 0; i < bus.length; i++) {
                    busPos.push([parseFloat(bus[i].lat), parseFloat(bus[i].lon)]);
                    busMarker.push(L.marker(busPos[i], {icon: iconeBus}).addTo(mymap));
                    nameStop = stopName(bus[i].next_stop);
                    busMarker[i].bindPopup("<b>Prochain arrêt : </b><br>" + nameStop);
                }
            } else {
                console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                document.getElementById('mapid').innerHTML = 'La carte n\'a pas pu être chargée.';
            }
        }
    };
    xhr.send();
}


function callAPIBusFav(line, dir) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/positions/' + line + '/' + dir);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                let bus = JSON.parse(xhr.responseText);
                busPosFav = [];
                for (let i = 0; i < busMarkerFav.length; i++) {
                    if (busMarkerFav[i] !== undefined) {
                        mymap.removeLayer(busMarkerFav[i]);
                    }
                }
                busMarkerFav = [];
                for (let i = 0; i < bus.length; i++) {
                    busPosFav.push([parseFloat(bus[i].lat), parseFloat(bus[i].lon)]);
                    busMarkerFav.push(L.marker(busPosFav[i], {icon: iconeBus}).addTo(mymap))
                }
            } else {
                console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                document.getElementById('mapid').innerHTML = 'La carte n\'a pas pu être chargée.';
            }
        }
    };
    xhr.send();
}

/**
 * Handle the stop pop up
 * @param stop The number of the stop
 * @returns The name of the stop
 */
function stopName(stop) {
    for (let i = 0; i < currentStop.length; i++) {
        if (currentStop[i].id === stop) {
            return currentStop[i].name;
        }
    }
}

/**
 * Make a call to the API
 * @param line The bus line
 * @param dir The direction of the bus line
 * @param stop The number of the stop
 * @param i The number associated with the marker
 */
function callAPIStops(line, dir, stop, i) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/arrivals/' + line + '/' + dir + '/' + stop);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                stopArrivals = JSON.parse(xhr.responseText);
                displayPopUp(stop, i);
            } else {
                console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                markers[i].bindPopup('L\'information n\'a pas pu être chargée.')
            }
        }
    };
    xhr.send();
}

/**
 * Display the pop up infos
 * @param stop The number of the stop
 * @param i The number associated with the marker
 */
function displayPopUp(stop, i) {

    // Display max 10 arrivals
    let counter = 0;
    let listArrivals = '';
    for (let j = 0; j < stopArrivals.length && counter < 10; j++) {
        counter++;
        if (stopArrivals[j].length === 4) {
            listArrivals += stopArrivals[j].slice(0, 2) + ':' + stopArrivals[j].slice(2, 4) + '<br>';
        } else {
            listArrivals += stopArrivals[j] + ' min <br>';
        }
    }

    // If no arrival have been found
    if (counter === 0) {
        listArrivals = 'Il n\'y a plus de bus aujourd\'hui ! <br>';
    }

    // Display the pop up
    markers[i].bindPopup("<b>" + currentStop[i].name + "</b><br>" + listArrivals);
}



function callAPIPos(lineId, dir) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:8080/stops/' + lineId + '/' + dir);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                stopList = JSON.parse(xhr.responseText);
                for (let j = 0; j < stopList.length; j++) {
                    // if (stopList[j].id === splitted[2]) {
                    //     name = stopList[j].name;
                    // }
                    // console.log(stopList[j]);
                    listFavorites[j] = stopList[j];
                }
            } else {
                console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };
    xhr.send();
}