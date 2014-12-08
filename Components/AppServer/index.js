var request = require('request');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var inMemoryDb = {};

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json

app.post('/', function (req, res) {
    console.log('post request', req.body);
    if (req.body && req.body.registrationId && req.body.endpoint) {
        if (!inMemoryDb[req.body.endpoint]) {
            inMemoryDb[req.body.endpoint] = [];
        }
        inMemoryDb[req.body.endpoint].push(req.body.registrationId);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('AppServer listening at http://%s:%s', host, port)
});


setInterval(function () {
    for (var endpoint in inMemoryDb) {
        if (inMemoryDb.hasOwnProperty(endpoint)) {
            var registrationIds = inMemoryDb[endpoint];
            console.log('send to endpoint ', endpoint);
          /*  request({
                method: 'POST',
                url: endpoint,
                headers: {
                    'Content-Type': 'application/json'
                }
            }, {*/

            request({
                method: 'POST',
                url: endpoint,
                json: {
                    registrationIds: registrationIds,
                    data: 'Notification! ' + Date.now()
                }
            }, function (error, response, body) {
                console.log('sent: ', error, body)
            });
        }
    }
}, 10000);