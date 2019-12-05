const http = require('http');

module.exports = {
    fetchPositions: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMPositions.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        let path = "/positions/"+route+"/"+direction;
        getData(url,path,res,0);
    },

    fetchArrivals: function (res, route, direction, stop) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop;
        let path = "/arrivals/"+route+"/"+direction+"/"+stop;
        getData(url,path,res,0);
    },

    fetchStops: function (res, route, direction) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMStops.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        let path = "/stops/"+route+"/"+direction;
        checkDb(url, path, res, 1);
    },

    fetchLines: function (res) {
        let url = 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110';
        let path = "/lines";
        checkDb(url, path, res, 1);
    }
};

function checkDb(apiUrl, path, res, test) {
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
                getData(apiUrl, path, res, test, dbo);
                console.log("La donnée n'est pas présente dans le cache.");
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

function getData(url, path, res, test, dbo) {
    http.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            res.send(data);
            if(test===1){
                addToDb(path, data, dbo);
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}