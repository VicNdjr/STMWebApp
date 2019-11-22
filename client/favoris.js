let favoris = [];

function display_fav() {
    document.getElementById("div-carte").style.display = "none";
    document.getElementById("tabs-horaires").style.display = "none";
    document.getElementById("div-favoris").style.display = "block";

    tabs_fav();
}


function tabs_fav() {
    let id = "";
    document.getElementById("div-favoris").innerHTML = "";

    for (let i = 0; i < favoris.length; i++) {
        id = "times" + i;
        document.getElementById("div-favoris").innerHTML += '<div class="favoris-tab"> <table> <thead> <tr> <th id="name">Prochains passages pour le favori :' + favoris[i] + '</th>  <th><a id="cross" href="#stops-tab">&#x2716;</a></th> </tr> </thead> <tbody id="times' + i + '"> </tbody> </table> <\div>';
        document.getElementById(id).innerHTML += '<tr> <td class="hour">' +
            '08' + ':' + '12' + '</td> </tr>';
    }
}

function add_fav(stop) {
    let found = false;
    for (let i = 0; i < favoris.length; i++) {
        if (favoris[i] === stop) {
            favoris.splice(i, 1);
            found = true;
        }
    }
    if (!found){
        favoris.push(stop);
        document.getElementById(stop).outerHTML = '<button class="button-green" id="' +
            stop + '" onclick="add_fav(this.id)">&#10003;</button>';
    } else {
        document.getElementById(stop).outerHTML = '<button class="button-grey" id="'+
            stop + '" onclick="add_fav(this.id)">+</button>';
    }
}

function is_fav(stop) {
    let found = false;
    for (let i = 0; i < favoris.length; i++) {
        if (favoris[i] === stop) {
            found = true;
        }
    }
    return found;
}