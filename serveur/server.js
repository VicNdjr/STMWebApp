var http = require('http');
var fs = require('fs');
var path = require('path');

let check;

http.createServer(function (req, res) {
    const http = require('http');
    if (req.url === "/") {
        fs.readFile("../client/index.html", "UTF-8", function (err, html) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    } else if (req.url.match("\.css$")) {
        var cssPath = path.join(__dirname, '../client', req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);

    } else if (req.url.match("\.png$")) {
        var imagePath = path.join(__dirname, '../client', req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    } else if (req.url.match("\.js$")) {
        var imagePath = path.join(__dirname, '../client', req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "application/javascript"});
        fileStream.pipe(res);
    } else if (req.url === "/lines") { //TODO : Actually use this code
        var monurl = 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110';
        data = checkDb(monurl);//PB --> data = undefined car checkDb asynchrone
        console.log("Résultat de checkDb :"+data);
        if(data){
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
            console.log("data récupérée");
        }else{
            http.get(monurl, (resp) => {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                    addToDb(monurl,data);
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
    } else if (req.url.startsWith("/stops")){
        var url_split = req.url.split('/');
        var route = url_split[2];
        var direction = url_split[3];
        monurl = 'http://teaching-api.juliengs.ca/gti525/STMStops.py'+
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        data = checkDb(monurl);
        if(data){
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
            console.log("data récupérée");
        }else {
            http.get(monurl, (resp) => {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                    addToDb(monurl,data);
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
    } else if (req.url.startsWith("/arrivals")){
        var url_split = req.url.split('/');
        var route = url_split[2];
        var direction = url_split[3];
        var stop = url_split[4];
        monurl = 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py'+
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop;
        var data = checkDb(monurl);
        console.log("Résultat de checkDb :"+data);
        if(data){
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
            console.log("data récupérée");
        }else {
            http.get(monurl, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                    addToDb(monurl,data);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }

    } else if (req.url.startsWith("/positions")){
        var url_split = req.url.split('/');
        var route = url_split[2];
        var direction = url_split[3];
        monurl = 'http://teaching-api.juliengs.ca/gti525/STMPositions.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
        data = checkDb(monurl);
        if(data!=null){//jamais exécuté
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
            console.log("data récupérée");
        }else {
            http.get(monurl, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                    addToDb(monurl,data);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
    } else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("No Page Found");
    }

}).listen(8080);

var checkDb = function (monurl){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("url").find({myurl : monurl}).toArray( function(err, result) {
            check = result;
            if(check.length>0){
                console.log("trouvé");
                return getData(monurl);
            }
            else {
                console.log("pas trouvé");
                return 0;
            }
        });
        //affiche la BDD
        /*dbo.collection("url").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
        });*/
    });

};

var addToDb = function (monurl, data) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = {myurl : monurl, mydata : data};
        dbo.collection("url").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Ajouté : "+myobj);
        });
    });
};

var getData = function (monurl) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("url").find({myurl : monurl}, /*{projection: {_id : 0, myurl : 0, mydata : 1}}*/).toArray( function(err, result) {
            var data = result[0].mydata;
            console.log("Data :"+result[0].mydata);
            return data;
        });
    });
};