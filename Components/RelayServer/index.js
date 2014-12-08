var http = require('http');
var express = require('express');
var gcm = require('node-gcm');

var app = express();
var port = process.argv[2] ? process.argv[2] : 8080;
var bodyParser = require('body-parser');

var httpServer = http.createServer(app);
var androidAPIKey = 'AIzaSyCjwXopyMFOpL0C5SOzvKdC9U3hVe2LZvw';

app.use(bodyParser.json()); // for parsing application/json

app.post('/', function(req, res){
    if (!req.body.registrationIds || !req.body.data) {
        res.sendStatus(400);
        return;
    }

    var registrationIds = req.body.registrationIds;
    var data = req.body.data;

    if (typeof registrationIds == 'string') {
        registrationIds = [registrationIds];
    }

    /*var message = new gcm.Message({
        collapseKey: 'demo',
        data: 'test'
    });*/
    console.log(registrationIds, data);

    var message = new gcm.Message({
        data: {
            title: data,
            message: data
        }
    });
    var sender = new gcm.Sender(androidAPIKey);
    sender.send(message, req.body.registrationIds, 4, function (err, result) {
        console.log('response from android data push', err, result);
        res.sendStatus(200);
    });
});

httpServer.listen(port);

console.log('PushServer started at port', port);