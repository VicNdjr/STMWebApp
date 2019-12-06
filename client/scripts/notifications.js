function sendNotifications() {
    setInterval(function () {
        let html = "";
        document.getElementById("notifications").innerHTML = "";
        for (let i = 0; i < favorites.length; i++) {
            let stop = favorites[i].substring(3);
            let splitted = stop.split("-");
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:8080/arrivals/' + splitted[0] + '/' + splitted[1] + '/' + splitted[2], true);
            xhr.responseType = 'text';

            //ASYNCHRONE
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        let arrival = JSON.parse(xhr.responseText);
                        if (arrival[0] < 6) {
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
    }, 5000);
}