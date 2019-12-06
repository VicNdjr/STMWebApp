const http = require('http');

let timeLine = 3600000; // 1h
let timeStop = 3600000; // 1h
let timeArrivals = 60000; // 1min
let timeBus = 10000; // 10s

module.exports = {
    fetchPositions: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMPositions.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        let path = "/positions/"+route+"/"+direction;
        checkDb(url,path,res,1, "positions");
    },

    fetchArrivals: function (res, route, direction, stop) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop;
        let path = "/arrivals/"+route+"/"+direction+"/"+stop;
        checkDb(url,path,res,1, "arrivals");
    },

    fetchStops: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMStops.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        let path = "/stops/"+route+"/"+direction;
        checkDb(url, path, res, 1, "stops");
    },

    fetchLines: function (res) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110';
        let path = "/lines";
        checkDb(url, path, res, 1, "lines");
    }
};

function checkDb(apiUrl, path, res, test, type) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("cache").find({mypath: path}).toArray(function (err, result) {
            //si on a la donnée en cache, on la récupère
            if (result.length > 0) {
                var data = result[0].mydata;
                res.end(data);
                console.log("Donnée récupérée depuis le cache.");
            } else { //sinon on fait le call à l'API
                if (type == "lines") {
                    getData(apiUrl, path, res, test, dbo, timeLine);
                }
                else if (type == "stops"){
                    getData(apiUrl, path, res, test, dbo, timeStop);
                }
                else if (type == "arrivals"){
                    getData(apiUrl, path, res, test, dbo, timeArrivals);
                }
                else {
                    getData(apiUrl, path, res, test, dbo, timeBus);
                }
                console.log("nope");
            }
        });
    });
}

function addToDb (path, data, dbo) {
    var newEntry = {mypath : path, mydata : data, user : "01AQ42110"};
    dbo.collection("cache").insertOne(newEntry, function(err, res) {
        if (err) throw err;
        console.log("Nouvelle donnée ajoutée à la base de donnée !");
    });
}

function deleteToDb (path, dbo) {
    var deleteEntry = {"mypath" : path};
    dbo.collection("cache").deleteOne(deleteEntry, function(err, res) {
        if (err) throw err;
        console.log("Data expirée et supprimée : " + path);
    });
}

function getData(url, path, res, test, dbo, timer) {
    http.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            res.send(data);
            if(test===1){
                addToDb(path, data, dbo);
                setTimeout(function () {
                    deleteToDb(path, dbo);
                }, timer);
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}