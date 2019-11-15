var http = require('http');
var fs = require('fs');
var path = require('path');

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
        http.get('http://teaching-api.juliengs.ca/gti525/STMLines.py' + '?apikey=01AQ42110', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } else if (req.url.startsWith("/stops")){
        var url_split = req.url.split('/');
        var route = url_split[2];
        var direction = url_split[3];
        http.get('http://teaching-api.juliengs.ca/gti525/STMStops.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

    } else if (req.url.startsWith("/arrivals")){
        var url_split = req.url.split('/');
        var route = url_split[2];
        var direction = url_split[3];
        var stop = url_split[4];
        http.get('http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

    } else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("No Page Found");
    }

}).listen(8080);