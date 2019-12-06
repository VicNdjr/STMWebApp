function sendNotifications() {
    let stop;
    let splitted;
    let html = "";
    document.getElementById("notifications").innerHTML = "";
    for (let i = 0; i < favorites.length; i++){
        stop = favorites[i].substring(3);
        splitted = stop.split("-");
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/arrivals/' + splitted[0] + '/' + splitted[1] + '/' + splitted[2], true);
        xhr.responseType = 'text';

        //ASYNCHRONE
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    arrivals = JSON.parse(xhr.responseText);
                    if (arrivals[0] < 6){
                        html = 'Ligne : ' + splitted[0] + ', Direction : ' + splitted[1] + ', Arrêt : ' + splitted[2]
                            + ' arrivée imminente <br>';
                        document.getElementById("notifications").innerHTML += html;
                    }
                } else {
                    console.log("Statut de la réponse: %d (%s)", this.status, this.statusText);
                }
            }
        };
        xhr.send();
    }
}