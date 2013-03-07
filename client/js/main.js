var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'pcs';

/* websocket */
var iWebSocket;

$(function() {
    /* view */
    window.indexView = new IndexView();
    indexView.render();
    window.tableListView = new TableListView();
    window.tableDefineView = new TableDefineView();
    window.tableDataView = new TableDataView();
    window.exporterListView = new ExporterListView();
    window.exporterDefineView = new ExporterDefineView();
    window.dialogView = new DialogView();
    window.dynamicMaker = new DynamicMaker();
    
    /* data */
    window.dataPool = new I.DataPool();

    NetController.Connect(function() {
        NetController.init();
    });
});
