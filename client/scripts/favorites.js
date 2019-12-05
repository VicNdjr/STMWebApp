// TODO: Commenter
let favorites = [];
let timeouts = [];

function display_fav() {
    document.getElementById("div-carte").style.display = "none";
    document.getElementById("tabs-horaires").style.display = "none";
    document.getElementById("div-favoris").style.display = "block";
    clearTimers();
    tabs_fav();
}


function tabs_fav() {
    let id = "";
    document.getElementById("div-favoris").innerHTML = "";
    let stop;
    let name;
    let stopList;
    let lineId;
    let dir;
    for (let i = 0; i < favorites.length; i++) {
        stop = favorites[i].substring(3);
        id = "times" + i;
        const splitted = stop.split("-");
        lineId = splitted[0];
        dir = splitted[1];

        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost:8080/stops/' + lineId + '/' + dir);
        xhr.responseType = 'text';

        //ASYNCHRONE
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    stopList = JSON.parse(xhr.responseText);
                    for (let j = 0; j < stopList.length; j++) {
                        if (stopList[j].id === splitted[2]) {
                            name = stopList[j].name;
                        }
                    }
                    document.getElementById("div-favoris").innerHTML += '<div class="favoris-tab"> <table> <thead> ' +
                        '<tr> <th id="name">Prochains passages pour le favori : ' + name + ' <br>Ligne ' + splitted[0] + ', Direction ' +
                        splitted[1] + '</th>  ' +
                        '<th><a id="' + 'cross' + favorites[i] + '" onclick="delete_fav(this.id)">&#x2716;</a></th> </tr> </thead> <tbody id="times' + i + '"> ' +
                        '</tbody> </table> <\div>';
                } else {
                    console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                    document.getElementById("allStops").innerHTML =
                        'Une erreur s\'est produite. Nous n\'avons pas pu charger les arrêts.';
                }

            }
        };
        xhr.send();

        displayFavorites(stop, id);
    }
}

function delete_fav(stop) {
    stop = stop.substring(5);
    add_fav(stop);
    tabs_fav();
}

/**
 * Launch a timer to actualise the time table every 5 seconds
 * @param stop Id of the stop that was clicked
 * @param elementId
 */
function displayFavorites(stop, elementId) {
    fetchArrivals(stop, elementId);
    timeouts.push(setInterval(function () {
        fetchArrivals(stop, elementId);
    }, 10000));
}

function clearTimers() {
    for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
}

function add_fav(stop) {
    let found = false;
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i] === stop) {
            favorites.splice(i, 1);
            found = true;
        }
    }
    if (!found) {
        if (favorites.length >= 10) {
            let modal = document.getElementById("myModal");
            let span = document.getElementsByClassName("close")[0];
            modal.style.display = "block";
            span.onclick = function () {
                modal.style.display = "none";
            }
        } else {
            favorites.push(stop);
            document.getElementById(stop).outerHTML = '<button class="button-green" id="' +
                stop + '" onclick="add_fav(this.id)">&#10003;</button>';
        }
    } else {
        document.getElementById(stop).outerHTML = '<button class="button-grey" id="' +
            stop + '" onclick="add_fav(this.id)">+</button>';
    }
}

function is_fav(stop) {
    let found = false;
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i] === stop) {
            found = true;
        }
    }
    return found;
}