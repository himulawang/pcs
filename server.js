require('i').init();
var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/www'));

var ctrl = require('./config/ctrl.js').ctrl;
app.post('/*', function(req, res) {
    var start = process.hrtime();
    try {
        I.Controller.process(ctrl, req.body, function(resData) {
            var r = {
                r: 0,
                d: resData,
            };
            res.send(JSON.stringify(r));
            console.log('req:', r, 'cost:', process.hrtime(start));
        });
    } catch (e) {
        console.log('Error:', e, 'cost:', process.hrtime(start));
        res.send(JSON.stringify({r: e.message}));
    }
});
app.listen(8080);
