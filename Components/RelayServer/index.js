var http = require('http');
var express = require('express');
var gcm = require('node-gcm');

var app = express();
var port = process.argv[2] ? process.argv[2] : 8080;
var httpServer = http.createServer(app);
var androidAPIKey = 'AIzaSyCjwXopyMFOpL0C5SOzvKdC9U3hVe2LZvw';

app.use(function (req, res, next) {
    console.log(req);
    if (req.body.data) {
        try {
            req.body = JSON.parse(req.body.data);
        } catch (e) {
            console.error('req.body.json could not be parsed:' + req.body.data);
        }
    }
    next();
});

app.post('/', function(req, res){
    if (!req.body.registrationIds) {
        return;
    }

    if (typeof req.body.registrationIds == 'string') {
        req.body.registrationIds = [req.body.registrationIds];
    }

    var message = new gcm.Message({
        collapseKey: 'demo',
        data: 'test'
    });
    var sender = new gcm.Sender(androidAPIKey);
    sender.send(message, req.body.registrationIds, 4, function (err, result) {
        console.log('response from android data push', err, result);
    });
});

httpServer.listen(port);

console.log('PushServer started at port', port);