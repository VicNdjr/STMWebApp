function affiche_horaires() {
    document.getElementById("div-carte").style.display = "none";
    document.getElementById("tabs-horaires").style.display = "block";
}

function affiche_carte() {
    document.getElementById("tabs-horaires").style.display = "none";
    document.getElementById("div-carte").style.display = "block";
}



var mymap = L.map('mapid').setView([45.505, -73.600], 12);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ3RpNTI1IiwiYSI6ImNrMW05cjRlZTBlMWIzY21uYWxpNjh2dmEifQ.9BAMULLZprP9pm2-70Q84g'
}).addTo(mymap);


var arret1 = [45.5, -73.6];
var arret2 = [45.51, -73.64];
var arret3 = [45.52, -73.6];
var arret4 = [45.53, -73.62];

var marker1 = L.marker(arret1).addTo(mymap);
var marker2 = L.marker(arret2).addTo(mymap);
var marker3 = L.marker(arret3).addTo(mymap);
var marker4 = L.marker(arret4).addTo(mymap);


var line = [
    arret1,
    arret2,
    arret3,
    arret4
];

var path = L.polyline(line, { color: '#00aeef' }).addTo(mymap);




marker1.bindPopup("<b>Arrêt 1</b><br>Liste des prochains arrêts.");
marker2.bindPopup("<b>Arrêt 2</b><br>Liste des prochains arrêts.");
marker3.bindPopup("<b>Arrêt 3</b><br>Liste des prochains arrêts.");
marker4.bindPopup("<b>Arrêt 4</b><br>Liste des prochains arrêts.");