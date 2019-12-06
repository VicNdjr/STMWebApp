let isTimerActive = false;
let timer;
let lines;
let arrivals;
let previousStops = {};
let currentLine;

/**
 * Fetch the data about all the bus lines and display it
 */
function displayLines() {
    let xhr = new XMLHttpRequest();
    lines = "";

    xhr.open('GET', 'http://localhost:8080/lines');

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
    loadFavorites();
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
