// Lancement serveur

var http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('MongoDB Connection');
}).listen(8080);



// Connection MongoDB

const password = "gti525";
const uri = "mongodb+srv://team14:" + password + "@cluster0-xwob0.mongodb.net/test?retryWrites=true&w=majority";

// const MongoClient = require('mongodb').MongoClient;

// const client = new MongoClient(uri, {
//     useNewUrlParser: true
//         // useUnifiedTopology: true
// });
// client.connect(err => {
//     const collection = client.db("test").collection("test");
//     console.log("Connexion : ");
//     console.log(collection.findOne());
//     // perform actions on the collection object
//     client.close();
// });



var mongoose = require('mongoose');
mongoose.connect(uri, {
    useNewUrlParser: true
        // useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we are connected");
});

module.exports = mongoose;