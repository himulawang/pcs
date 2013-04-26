require('i').init();
var WebSocketServer = require('websocket').server;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(STA_ABS_PATH));

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

        I.Ctrl.NetController.GetOnlineUserCount(null, 'C0002', {});
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
I.Models.TablePKStore.get(function(err, data) {
    dataPool.set('table', 'PK', data);
});
I.Models.ColumnPKStore.get(function(err, data) {
    dataPool.set('column', 'PK', data);
});
I.Models.ExporterPKStore.get(function(err, data) {
    dataPool.set('exporter', 'PK', data);
});

// Object / List
I.Models.TableListStore.get(0 /* Unique */, function(err, data) {
    if (err) return console.log(err);
    dataPool.set('tableList', 0, data);

    var id;
    for (var id in data.list) {
        getColumnList(id);
    }
});

I.Models.ExporterListStore.get(0 /* Unique */, function(err, data) {
    if (err) return console.log(err);
    dataPool.set('exporterList', 0, data);
});

function getColumnList(id) {
    I.Models.ColumnListStore.get(id, function(err, data) {
        if (err) return console.log(err);
        dataPool.set('columnList', id, data);

        // make dynamic classes
        I.Lib.DynamicMaker.make(id);

        getTableData(id);
    });
};

global.getTableData = function getTableData(id) {
    var DataPKStoreClass = I.Lib.DynamicMaker.getPKStoreClass(id);
    DataPKStoreClass.get(function(err, data) {
        if (err) return console.log(err);
        dataPool.set('dataPK', id, data);
    });
    var DataListStoreClass = I.Lib.DynamicMaker.getListStoreClass(id);
    DataListStoreClass.get(id, function(err, data) {
        if (err) return console.log(err);
        dataPool.set('dataList', id, data);
    });
};

var env = require(APP_ABS_PATH + '/config/env.js').env;
var backup = new I.Lib.Backup(env.BACKUP_PATH, env.BACKUP_INTERVAL);
setTimeout(function() {
    console.log(dataPool.pool);
    server.listen(env.HTTP_PORT);
}, 1000);

setInterval(function() {
    dataPool.sync();
    console.log('Syncing');
    backup.backup();
}, 10000);
