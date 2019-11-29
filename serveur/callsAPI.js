const http = require('http');

module.exports = {
    fetchPositions: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMPositions.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        checkDb(url, res, 0);
    },

    fetchArrivals: function (res, route, direction, stop) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop;
        checkDb(url, res, 0);
    },

    fetchStops: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMStops.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        checkDb(url, res, 1);
    },

    fetchLines: function (res) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110';
        checkDb(url, res, 1);
    }
};

function checkDb(monurl, res, test) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("url").find({myurl: monurl}).toArray(function (err, result) {
            if (result.length > 0) {
                var data = result[0].mydata;
                res.end(data);
                console.log("data récupérée");
            } else {
                getData(monurl, res, test, dbo);
            }
        });
    });
}

function addToDb (monurl, data, dbo) {
    var myobj = {myurl : monurl, mydata : data}; //ajouter champ user
    dbo.collection("url").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("Ajouté : "+myobj);
    });

}

function getData(url, res, test, dbo) {
    http.get(url, (resp) => {
        let data = '';
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.send(data);
            if(test===1){
                addToDb(url, data, dbo);
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}