let pos;
let bus;
var markers = [];
var path = [];
var line;
var busPos = [];
var busMarker = [];
var nameStop;
let timerBus;
let stopArrivals;
var lastline;

function affiche_horaires() {
    document.getElementById("div-carte").style.display = "none";
    document.getElementById("tabs-horaires").style.display = "block";
}

function affiche_carte() {
    document.getElementById("tabs-horaires").style.display = "none";
    document.getElementById("div-carte").style.display = "block";
    //console.log(currentstop);
    //clearMap();
    //loadMap();
    /*if(currentLine!==lastline){
        window.setInterval(loadMap, 2000);
    }*/
}

function loadMap(){
    clearMap();
    if(currentstop){
        lastline=currentLine;
        for(let i=0;i<currentstop.length;i++){
            var arret = [parseFloat(currentstop[i].lat),parseFloat(currentstop[i].lon)];
            //console.log(arret);
            markers[i] = L.marker(arret).addTo(mymap);
            path.push(arret);

            let splittedLine = currentLine.split("-");
            let dirLine = splittedLine[2].substr(0, 1);
            if (dirLine == 'O') {
                dirLine = 'W';
            }
            markers[i].bindPopup("<b>"+currentstop[i].name+"</b><br>Liste des prochains arrêts.");
            callAPIStops(splittedLine[1], dirLine, currentstop[i].id, i); //APPEL API
        }
        line = L.polyline(path, { color: '#00aeef' }).addTo(mymap);
        busFunction();
        timerBus = setInterval(function() {
            busFunction(); //APPEL API
        }, 10000);
        mymap.fitBounds([
            [parseFloat(currentstop[0].lat), parseFloat(currentstop[0].lon)],
            [parseFloat(currentstop[currentstop.length - 1].lat), parseFloat(currentstop[currentstop.length - 1].lon)]
        ]);
    }
}



function clearMap() {
    for(let i=0;i<markers.length;i++){
        if (markers[i]!= undefined) {
            mymap.removeLayer(markers[i]);
        }
    }
    path = [];
    if (line != undefined) {
        mymap.removeLayer(line);
    }
    line = undefined;
    busPos = [];
    for (let i = 0; i < busMarker.length; i++) {
        if (busMarker[i] != undefined) {
            mymap.removeLayer(busMarker[i]);
        }
    }
    busMarker = [];
    clearInterval(timerBus);
}

// creation carte et centrage
var mymap = L.map('mapid').setView([45.505, -73.600], 12.5);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ3RpNTI1IiwiYSI6ImNrMW05cjRlZTBlMWIzY21uYWxpNjh2dmEifQ.9BAMULLZprP9pm2-70Q84g'
}).addTo(mymap);


// icone de bus
var iconeBus = L.icon({
    iconUrl: 'bus.png',
    iconSize: [20, 20]
});

function busFunction() {
    let splittedLine = currentLine.split("-");
    let dirLine = splittedLine[2].substr(0, 1);
    if (dirLine == 'O') {
        dirLine = 'W';
    }
    callAPIBus(splittedLine[1], dirLine);
}

function callAPIBus(line, dir) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMPositions.py' +
        '?apikey=01AQ42110&route=' + line + '&direction=' + dir);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                var bus = JSON.parse(xhr.responseText);
                busPos = [];
                for (let i = 0; i < busMarker.length; i++) {
                    if (busMarker[i] != undefined) {
                        mymap.removeLayer(busMarker[i]);
                    }
                }
                busMarker = [];
                for (let i = 0; i < bus.length; i++) {
                    busPos.push([parseFloat(bus[i].lat), parseFloat(bus[i].lon)]);
                    busMarker.push(L.marker(busPos[i], { icon: iconeBus }).addTo(mymap));
                    nameStop = stopName(bus[i].next_stop);
                    busMarker[i].bindPopup("<b>Prochain arrêt : </b><br>" + nameStop);
                }
            }
        } else {
            console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
        }
    };
    xhr.send();
}



function stopName(stop) {
    for (var i = 0; i < currentstop.length; i++) {
        if (currentstop[i].id === stop) {
            return currentstop[i].name;
        }
    }
}

function callAPIStops(line, dir, stop, i) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
        '?apikey=01AQ42110&route=' + line + '&direction=' + dir + '&stopCode=' + stop);
    xhr.responseType = 'text';

    //ASYNCHRONE
    xhr.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                stopArrivals = JSON.parse(xhr.responseText);
                displayPopUp(stop, i);
            }
        } else {
            console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
        }
    };
    xhr.send();
}

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
    markers[i].bindPopup("<b>" + currentstop[i].name + "</b><br>" + listArrivals);
}