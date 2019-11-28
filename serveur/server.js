const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (req, res) {
    let direction;
    let route;
    let url_split;
    let imagePath;
    let fileStream;
    const http = require('http');
    if (req.url === "/") {
        // Index page
        fs.readFile("../client/index.html", "UTF-8", function (err, html) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    } else if (req.url.match("\.css$")) {
        // Send the css files
        let cssPath = path.join(__dirname, '../client', req.url);
        fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);

    } else if (req.url.match("\.png$")) {
        // Send the png files
        imagePath = path.join(__dirname, '../client', req.url);
        fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    } else if (req.url.match("\.js$")) {
        // Send the js files
        imagePath = path.join(__dirname, '../client', req.url);
        fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "application/javascript"});
        fileStream.pipe(res);
    } else if (req.url === "/lines") {
        // API page for the lines
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
    } else if (req.url.startsWith("/stops")) {
        // API page for the stops
        url_split = req.url.split('/');
        route = url_split[2];
        direction = url_split[3];
        http.get('http://teaching-api.juliengs.ca/gti525/STMStops.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction, (resp) => {
            let data = '';

            // A chunk of data has been received.
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

    } else if (req.url.startsWith("/arrivals")) {
        // API page for the arrivals
        url_split = req.url.split('/');
        route = url_split[2];
        direction = url_split[3];
        let stop = url_split[4];
        http.get('http://teaching-api.juliengs.ca/gti525/STMArrivals.py' +
            '?apikey=01AQ42110&route=' + route + '&direction=' + direction + '&stopCode=' + stop, (resp) => {
            let data = '';

            // A chunk of data has been received.
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

    } else if (req.url.startsWith("/positions")) {
        // API page for the positions
        url_split = req.url.split('/');
        route = url_split[2];
        direction = url_split[3];
        http.get('http://teaching-api.juliengs.ca/gti525/STMPositions.py' +
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

    } else {
        // Unknown page, send error 404
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("No Page Found");
    }

}).listen(8080);

// Print the link to ease access
console.log("http://localhost:8080/");