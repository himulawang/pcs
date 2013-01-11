require('i').init();
var WebSocketServer = require('websocket').server;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(APP_ABS_PATH + '/client'));

var routes = require('./config/routes.js').routes;

var ws = new WebSocketServer({
    httpServer: server,
});

global.connectionPool = new I.ConnectionPool();
var Route = new I.Route(routes);
ws.on('request', function(req) {
    var connection = req.accept('pcs', req.origin);
    connectionPool.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);

    connection.on('close', function(reasonCode, description) {
        console.log(reasonCode, description);
        connectionPool.remove(connection);

        NetController.GetOnlineUserCount(null, 'C0002', {});
    });

    connection.on('message', function(message) {
        var start = process.hrtime();

        if (message.type === 'binary') return;
        var req = JSON.parse(message.utf8Data);

        try {
            Route.process(connection, req);
        } catch (e) {
            console.log('Error', e);
        }
    });
});

// retrieve data to memory
global.dataPool = new I.DataPool();
// PK
db.get(I.Const.GLOBAL_KEY_PREFIX + TableModel.abb, function(err, data) {
    if (err) return console.log(err);
    dataPool.setPK(TableModel.abb, data);
});

db.get(I.Const.GLOBAL_KEY_PREFIX + ColumnModel.abb, function(err, data) {
    if (err) return console.log(err);
    dataPool.setPK(ColumnModel.abb, data);
});

// Object / List
TableListModel.retrieve(0 /* Unique */, function(err, data) {
    if (err) return console.log(err);
    dataPool.set('tableList', 0, data);

    var id;
    for (var id in data.list) {
        getColumnList(id);
    }
});

function getColumnList(id) {
    ColumnListModel.retrieve(id, function(err, data) {
        if (err) return console.log(err);
        dataPool.set('columnList', id, data);
    });
};

setTimeout(function() {
    console.log(dataPool.pool);
    server.listen(8081);
}, 1000);

