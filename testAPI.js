
function displaylines2() {
var xhr = new XMLHttpRequest();
var resp = "";

xhr.open('GET', 'http://teaching-api.juliengs.ca/gti525/STMLines.py'+'?apikey=01AQ36490');

xhr.responseType = 'text';

//ASYNCHRONE
xhr.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                console.log("Réponse reçue: %s", this.responseText);
                resp = JSON.parse(xhr.responseText);
                for (var i = 0; i < resp.length; i++) {
                    document.getElementById("allLines").innerHTML += '<li>' + resp[i].id + ' ' + resp[i].name + ' (' +
                        resp[i].direction + ')' + '</li>';

                    if (resp[i].category === 'local') {
                        document.getElementById("localLines").innerHTML += '<li>' + resp[i].id + ' ' + resp[i].name + ' (' +
                            resp[i].direction + ')' + '</li>';
                    } else if (resp[i].category === 'night') {
                        document.getElementById("nightLines").innerHTML += '<li>' + resp[i].id + ' ' + resp[i].name + ' (' +
                            resp[i].direction + ')' + '</li>';
                    } else if (resp[i].category === 'express') {
                        document.getElementById("expressLines").innerHTML += '<li>' + resp[i].id + ' ' + resp[i].name + ' (' +
                            resp[i].direction + ')' + '</li>';
                    } else if (resp[i].category === 'dedicated') {
                        document.getElementById("shuttleLines").innerHTML += '<li>' + resp[i].id + ' ' + resp[i].name + ' (' +
                            resp[i].direction + ')' + '</li>';
                    } else if (resp[i].category === 'shuttleOr') {
                        document.getElementById("shuttleOrLines").innerHTML += '<li>' + resp[i].id + ' ' + resp[i].name + ' (' +
                            resp[i].direction + ')' + '</li>';
                    }

                    console.log(resp[i].category);
                }
                //displaylines2();
            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
};

xhr.send();
}