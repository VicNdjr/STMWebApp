let pos;
let bus;
var markers = [];
var path = [];
var line;
var busPos = [];
var busMarker = [];
/**
 * Display the line and all its stops in the table
 * @param lineId Id of the line that was clicked
 * @param direction Direction of the line that was clicked
 */

function affiche_horaires() {
    document.getElementById("div-carte").style.display = "none";
    document.getElementById("tabs-horaires").style.display = "block";
}

function affiche_carte() {
    document.getElementById("tabs-horaires").style.display = "none";
    document.getElementById("div-carte").style.display = "block";
    //console.log(currentstop);
    clearMap();
    if (currentstop) {
        for (let i = 0; i < currentstop.length; i++) {
            var arret = [parseFloat(currentstop[i].lat), parseFloat(currentstop[i].lon)];
            markers[i] = L.marker(arret).addTo(mymap);
            path.push(arret);
            //bus = L.marker([currentstop[0].lon, currentstop[0].lat], { icon: iconeBus }).addTo(mymap);
            markers[i].bindPopup("<b>" + currentstop[i].name + "</b><br>Liste des prochains arrêts.");
        }
        line = L.polyline(path, { color: '#00aeef' }).addTo(mymap);
        busFunction();
    }
}

function clearMap() {
    for (let i = 0; i < markers.length; i++) {
        if (markers[i] != undefined) {
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
    iconSize: [22, 22]
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
                for (let i = 0; i < bus.length; i++) {
                    busPos.push([parseFloat(bus[i].lat), parseFloat(bus[i].lon)]);
                    busMarker.push(L.marker(busPos[i], { icon: iconeBus }).addTo(mymap));
                }
            }
        } else {
            console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
        }
    };
    xhr.send();
}
//var bus = L.marker([45.505, -73.61], { icon: iconeBus }).addTo(mymap);

//var arret1 = [45.5, -73.6];
//var marker1 = L.marker(arret1).addTo(mymap);

// icones des arrêts
/*
var arret1 = [45.5, -73.6];
var arret2 = [45.51, -73.62];
var arret3 = [45.52, -73.6];
var arret4 = [45.505, -73.56];

var marker1 = L.marker(arret1).addTo(mymap);
var marker2 = L.marker(arret2).addTo(mymap);
var marker3 = L.marker(arret3).addTo(mymap);
var marker4 = L.marker(arret4).addTo(mymap);*

// tracé de ligne
var line = [
    arret1,
    arret2,
    arret3,
    arret4
];

var path = L.polyline(line, { color: '#00aeef' }).addTo(mymap);



// popups
marker1.bindPopup("<b>Arrêt 1</b><br>Liste des prochains arrêts.");
marker2.bindPopup("<b>Arrêt 2</b><br>Liste des prochains arrêts.");
marker3.bindPopup("<b>Arrêt 3</b><br>Liste des prochains arrêts.");
marker4.bindPopup("<b>Arrêt 4</b><br>Liste des prochains arrêts.");

bus.bindPopup("Prochain arrêt : Arrêt 2");

 */