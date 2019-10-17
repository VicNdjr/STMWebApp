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