const http = require('http');

module.exports = {
    fetchPositions: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMPositions.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        getData(url, res);
    },

    fetchArrivals: function (res, route, direction, stop) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop;
        getData(url, res);
    },

    fetchStops: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMStops.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        getData(url, res);
    },

    fetchLines: function (res) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110';
        getData(url, res);
    }
};

function getData(url, res) {
    http.get(url, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.send(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}