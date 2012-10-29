require('i').init();
var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/www'));

var ctrl = require('./config/ctrl.js').ctrl;

app.post('/*', function(req, res) {
    var start = process.hrtime();
    I.Controller.process(ctrl, req.body, function(args) {
        var err = args[0];
        var resData = args[1];
        var r = {};
        if (err) {
            if (err instanceof I.Exception) {
                r.r = err.message;
                r.m = I.ExceptionCodes[r.r];
            } else {
                r.r = -1;
                r.m = 'Unexpected Error.';
            }
        } else {
            r.r = 0;
            r.d = resData;
        }
        res.send(JSON.stringify(r));

        var end = process.hrtime(start);
        console.log('req:', req.body.req, 'result:', r, 'cost:', (end[0] + end[1] / 1000000000) * 1000 + 'ms');
    });
});
app.listen(8081);
