var dm = require('domain');


var domain = dm.create();
domain.on('error', function(err) {
    console.log(err);
    if (err instanceof I.Exception) {
        console.log('Expected I.Exception.', err.message);
        return;
    } 
    console.log('Unexpected error.');
});

require('i').init();
var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/www'));

var ctrl = require('./config/ctrl.js').ctrl;

app.post('/*', function(req, res) {
    var start = process.hrtime();
    I.Controller.process(ctrl, req.body, function(resData) {
        var r = {
            r: 0,
            d: resData,
        };
        res.send(JSON.stringify(r));

        var end = process.hrtime(start);
        console.log('req:', req.body.req, 'result:', r, 'cost:', (end[0] + end[1] / 1000000000) * 1000 + 'ms');
    });
});
app.listen(8080);
