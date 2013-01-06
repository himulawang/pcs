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

        try {
            I.Route.process(connection, req);
        } catch (e) {
            console.log('Error', e);
        }
    });
});

// retrieve data to memory
global.dataPool = {};
var tableList;
TableListModel.retrieve(0 /* Unique */, function(err, data) {
    if (err) return err;
    dataPool['tableList'] = data;
});
