var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'pcs';

/* websocket */
var iWebSocket;

$(function() {
    /* vendor */
    window.jsonFormatter = new JSONFormatter();

    /* view */
    window.indexView = new IndexView();
    indexView.render();

    window.tableListView = new TableListView();
    window.tableDefineView = new TableDefineView();
    window.tableDataView = new TableDataView();
    window.exporterListView = new ExporterListView();
    window.exporterDefineView = new ExporterDefineView();
    window.exporterDataView = new ExporterDataView();
    window.dialogView = new DialogView();
    window.dynamicMaker = new DynamicMaker();
    
    /* data */
    window.dataPool = new I.DataPool();

    NetController.Connect(function() {
        NetController.init();
    });
});

function ross() {console.log(111)};

//https://github.com/callumlocke/json-formatter
