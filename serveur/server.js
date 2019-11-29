var http = require('http');
var fs = require('fs');
var path = require('path');

let check;
var monurl;
let test;

http.createServer(function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    check = 0;
    test = 0;
    res.setHeader('Content-Type', 'application/json');
        const http = require('http');
        if (req.url === "/") {
            fs.readFile("../client/index.html", "UTF-8", function (err, html) {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(html);
            });
            check = 1;
        } else if (req.url.match("\.css$")) {
            var cssPath = path.join(__dirname, '../client', req.url);
            var fileStream = fs.createReadStream(cssPath, "UTF-8");
            res.writeHead(200, {"Content-Type": "text/css"});
            fileStream.pipe(res);
            check = 1;
        } else if (req.url.match("\.png$")) {
            var imagePath = path.join(__dirname, '../client', req.url);
            var fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, {"Content-Type": "image/png"});
            fileStream.pipe(res);
            check = 1;
        } else if (req.url.match("\.js$")) {
            var imagePath = path.join(__dirname, '../client', req.url);
            var fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, {"Content-Type": "application/javascript"});
            fileStream.pipe(res);
            check = 1;
        } else if (req.url === "/lines") { //TODO : Actually use this code
            monurl = 'http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110';
            //rajouter champs user dans la BDD
            check = 1;
        } else if (req.url.startsWith("/stops")){
            var url_split = req.url.split('/');
            var route = url_split[2];
            var direction = url_split[3];

            monurl = 'http://teaching-api.juliengs.ca/gti525/STMStops.py'+ '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
            check = 1;
        } else if (req.url.startsWith("/arrivals")){
            var url_split = req.url.split('/');
            var route = url_split[2];
            var direction = url_split[3];
            var stop = url_split[4];
            monurl = 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py'+ '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop;
            //getData(monurl, res);
            test = 2;
            check = 1;
        } else if (req.url.startsWith("/positions")){
            var url_split = req.url.split('/');
            var route = url_split[2];
            var direction = url_split[3];
            monurl = 'http://teaching-api.juliengs.ca/gti525/STMPositions.py' + '?apikey=01AQ42110&route=' + route + '&direction=' + direction;
            //getData(monurl, res);
            test = 2;
            check = 1;
        }
        if(check === 1){

        }else if (check===0){
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("No Page Found");
        }

}).listen(8080);

var checkDb = function (url,monurl,) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        if(test === 2){
            getData(monurl,res);
        }else{
            dbo.collection("url").find({myurl: monurl}).toArray(function (err, result) {
                if (result.length > 0) {
                    var data = result[0].mydata;
                    res.end(data);
                    console.log("data récupérée");
                } else {
                    http.get(monurl, (resp) => {
                        let data = '';
                        // A chunk of data has been recieved.
                        resp.on('data', (chunk) => {
                            //res.setHeader('Content-Type', 'application/json');
                            //Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
                            //PB = requête http pour positions et arrivals
                            data += chunk;
                            test = 2;
                        });
                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            //res.setHeader('Content-Type', 'application/json');
                            res.end(data);
                            addToDb(monurl, data);
                            test = 2;
                        });
                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                    });
                }
            });
        }
    });
}


var addToDb = function (monurl, data) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = {myurl : monurl, mydata : data}; //ajouter champ user
        dbo.collection("url").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Ajouté : "+myobj);
        });
    });
};


var getData = function (monurl, res) {
    http.get(monurl, (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {

            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //res.setHeader('Content-Type', 'application/json');
            res.end(data);

        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    //test = 2;
};

//affiche la BDD
/*dbo.collection("url").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
});*/