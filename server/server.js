require('i').init();
var WebSocketServer = require('websocket').server;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(APP_ABS_PATH + '/client'));
server.listen(8081);

var routes = require('./config/routes.js').routes;

var ws = new WebSocketServer({
    httpServer: server,
});

global.connectionPool = new I.ConnectionPool();
ws.on('request', function(req) {
    var connection = req.accept('pcs', req.origin);
    connectionPool.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);

    connection.on('close', function(reasonCode, description) {
        console.log(reasonCode);
        console.log(description);

        connectionPool.remove(connection);
    });

    connection.on('message', function(message) {
        var start = process.hrtime();

        if (message.type === 'binary') return;
        var req = JSON.parse(message.utf8Data);

        var response = function(args) {
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
            r.a = req.a;
            connection.sendUTF(JSON.stringify(r));

            var end = process.hrtime(start);
            console.log('req:', req.a, 'result:', r, 'cost:', (end[0] + end[1] / 1000000000) * 1000 + 'ms');
        };
        I.Route.process(routes, req, response);
    });
});
