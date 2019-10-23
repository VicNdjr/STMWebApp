
function callAPI() {
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
                    fetchLines(resp);
                } else {
                    console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
                }
            }
    };

    xhr.send();
}
